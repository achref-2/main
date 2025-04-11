const router = require("express").Router();
const {
  Candidate,
  validateCV,
  validateAnalysis,
} = require("../models/candidate");
const { User, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");
const { Job } = require("../models/Job");
// Configuration
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB limit
const MAX_CV_HISTORY = 10;
const TOKEN_EXPIRY = "7d";
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const generateJWT = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWTPRIVATEKEY,
    { expiresIn: TOKEN_EXPIRY }
  );
};

const generateUserResponse = (user, candidateId = null) => {
  const response = {
    message: "Success",
    token: generateJWT(user),
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      role: user.role,
    },
  };

  if (candidateId) {
    response.candidateId = candidateId;
  }

  return response;
};

const generateSuggestions = (analysisResult) => {
  const suggestions = [];

  if (analysisResult.similarity_score < 50) {
    suggestions.push(
      "Your CV has low relevance to this job. Consider tailoring it specifically to highlight relevant skills and experience."
    );
  } else if (analysisResult.similarity_score < 70) {
    suggestions.push(
      "Your CV has moderate relevance. Try emphasizing more keywords from the job description."
    );
  }

  const detectedSkills = analysisResult.entities?.SKILL || [];
  if (detectedSkills.length < 5) {
    suggestions.push(
      "Include more specific skills in your CV that are relevant to the position."
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Your CV matches well with the job description. Consider adding more achievements with quantifiable results."
    );
  }

  return suggestions;
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/cvs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    // Use user ID if available, otherwise a timestamp placeholder
    const userId = req.user ? req.user._id : "temp";
    cb(null, `${userId}-${uniqueSuffix}${extension}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_CV_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF and Word documents are allowed.")
      );
    }
  },
});

// Route handlers

// Register a new candidate (signup)
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { error: userError } = validateUser(req.body);
    if (userError)
      return res.status(400).json({ message: userError.details[0].message });
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser)
      return res
        .status(409)
        .json({ message: "User with this email already exists!" });

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName || "",
      email: req.body.email,
      password: hashedPassword,
      role: "candidate",
    });

    const savedUser = await user.save();

    const candidate = new Candidate({
      userId: savedUser._id,
      cvHistory: [],
      latestAnalysis: null,
    });

    await candidate.save();

    res.status(201).json({
      ...generateUserResponse(savedUser),
      message: "Candidate created successfully",
    });
  })
);

// Login for candidates
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email, role: "candidate" });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).json({ message: "Invalid email or password" });

    const candidate = await Candidate.findOne({ userId: user._id });
    if (!candidate)
      return res.status(404).json({ message: "Candidate profile not found" });
    const token = generateJWT(user);

    // Log the token to the console
    console.log("Generated JWT Token:", token);
    res.status(200).json({
      ...generateUserResponse(user, candidate._id),
      message: "Logged in successfully",
    });
  })
);

// Upload CV - Protected route for candidates only
router.post(
  "/upload-cv",
  auth,
  checkRole(["candidate"]),
  upload.single("cv"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileData = {
      fileUrl: `/uploads/cvs/${req.file.filename}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
    };

    const { error } = validateCV(fileData);
    if (error) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: error.details[0].message });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    if (candidate.cvHistory.length >= MAX_CV_HISTORY) {
      const oldestCV = candidate.cvHistory[0];
      const oldFilePath = path.join(__dirname, "..", oldestCV.fileUrl);

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      candidate.cvHistory.shift();
    }

    candidate.cvHistory.push({
      ...fileData,
      uploadDate: new Date(),
    });

    await candidate.save();

    res.status(200).json({
      message: "CV uploaded successfully",
      cv: candidate.getLatestCVWithAnalysis(),
    });
  })
);
router.post(
  "/save-candidate-data",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    try {
      const {
        personalInfo,
        experience,
        education,
        skills,
        certifications = [], // Default to an empty array if not provided
        languages = [], // Default to an empty array if not provided
        activities = [], // Default to an empty array if not provided
      } = req.body;

      // Log the incoming request data
      console.log("Incoming data:", {
        personalInfo,
        experience,
        education,
        skills,
        certifications,
        languages,
        activities,
      });

      // Validate the required fields
      if (!personalInfo || !experience || !education || !skills) {
        console.log("Validation failed: Missing required fields");
        return res.status(400).json({ message: "Required fields are missing" });
      }

      // Find the candidate profile
      const candidate = await Candidate.findOne({ userId: req.user._id });
      if (!candidate) {
        console.log("Candidate profile not found for userId:", req.user._id);
        return res.status(404).json({ message: "Candidate profile not found" });
      }

      // Log the existing candidate data
      console.log("Existing candidate data:", candidate);

      // Update candidate data
      const updatedData = {
        personalInfo,
        experience,
        education,
        skills,
        certifications,
        languages,
        activities,
      };
      Object.assign(candidate, updatedData);

      // Save the updated candidate data
      await candidate.save();

      // Log the updated candidate data
      console.log("Updated candidate data:", candidate);

      res.status(200).json({
        message: "Candidate data saved successfully",
        candidate,
      });
    } catch (error) {
      console.error("Error saving candidate data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
// Submit analysis for a CV
router.post(
  "/submit-analysis/:cvIndex",
  auth,
  checkRole(["admin", "recruiter"]),
  asyncHandler(async (req, res) => {
    const { candidateId, analysisData } = req.body;
    const cvIndex = parseInt(req.params.cvIndex);

    if (isNaN(cvIndex) || cvIndex < 0) {
      return res.status(400).json({ message: "Invalid CV index" });
    }

    const { error } = validateAnalysis(analysisData);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const candidate = await Candidate.findById(candidateId);
    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    if (cvIndex >= candidate.cvHistory.length) {
      return res
        .status(404)
        .json({ message: "CV not found at specified index" });
    }

    await candidate.addAnalysis(cvIndex, analysisData);

    res.status(200).json({
      message: "Analysis submitted successfully",
      analysis: candidate.latestAnalysis,
    });
  })
);

// Get candidate profile - Protected route
router.get(
  "/profile",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const candidate = await Candidate.findOne({
      userId: req.user._id,
    }).populate("userId", "-password");

    if (!candidate)
      return res.status(404).json({ message: "Candidate profile not found" });

    res.status(200).json(candidate);
  })
);
router.get(
  "/get-candidate-data",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    try {
      // Fetch the candidate profile and populate related fields
      const candidate = await Candidate.findOne({ userId: req.user._id }).populate("userId", "name email");

      if (!candidate) {
        console.log("Candidate profile not found for userId:", req.user._id);
        return res.status(404).json({ message: "Candidate profile not found" });
      }

      // Extract the required fields with default values
      const {
        personalInfo,
        experience,
        education,
        skills,
        certifications = [], // Default to an empty array if not present
        languages = [], // Default to an empty array if not present
        activities = [], // Default to an empty array if not present
      } = candidate;

      // Log the fetched candidate data
      console.log("Fetched candidate data:", {
        personalInfo,
        experience,
        education,
        skills,
        certifications,
        languages,
        activities,
      });

      // Respond with the candidate data
      res.status(200).json({
        message: "Candidate data retrieved successfully",
        candidate: {
          personalInfo,
          experience,
          education,
          skills,
          certifications,
          languages,
          activities,
        },
      });
    } catch (error) {
      console.error("Error fetching candidate data:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  })
);
// Get candidate's latest CV
router.get(
  "/latest-cv",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const candidate = await Candidate.findOne({ userId: req.user._id });

    if (!candidate)
      return res.status(404).json({ message: "Candidate profile not found" });

    const latestCV = candidate.getLatestCVWithAnalysis();
    if (!latestCV) {
      return res
        .status(404)
        .json({ message: "No CV found for this candidate" });
    }

    res.status(200).json(latestCV);
  })
);

router.get("/profile", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id })
      .populate('userId', '-password')
      .populate('jobPostings');
    
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    res.status(200).send(recruiter);
  } catch (error) {
    console.error("Error fetching recruiter profile:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Get all CVs for the candidate
router.get(
  "/cv-history",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const candidate = await Candidate.findOne({ userId: req.user._id });

    if (!candidate)
      return res.status(404).json({ message: "Candidate profile not found" });

    const history = candidate.cvHistory.map((cv, index) => ({
      index,
      fileName: cv.fileName,
      fileSize: cv.fileSize,
      fileType: cv.fileType,
      uploadDate: cv.uploadDate,
      hasAnalysis: !!cv.analysis,
    }));

    res.status(200).json(history);
  })
);

// Analyze CV with job description
router.post(
  "/analyze-cv",
  auth,
  checkRole(["candidate"]),
  upload.single("cv"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No CV file uploaded" });
    }

    if (!req.body.jobDescription) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Job description is required" });
    }

    const cvPath = req.file.path;

    // Run analysis as a Promise
    const analyzeCV = new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        path.join(__dirname, "../python/cv_analyzer.py"),
        cvPath,
        path.join(__dirname, "../Datasets/skills_and_experience.csv"),
        req.body.jobDescription,
      ]);

      let analysisResult = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        analysisResult += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error(`Python script error: ${data.toString()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return reject(
            new Error(`Python script failed with code ${code}: ${errorOutput}`)
          );
        }

        if (!analysisResult.trim()) {
          return reject(new Error("No output from analysis"));
        }

        try {
          const result = JSON.parse(analysisResult);
          resolve(result);
        } catch (error) {
          reject(
            new Error(`Failed to parse analysis results: ${error.message}`)
          );
        }
      });
    });

    try {
      const result = await analyzeCV;

      result.suggestions = generateSuggestions(result);

      const analysisData = {
        similarity_score: result.similarity_score,
        skills: result.entities?.SKILL || [],
        suggestions: result.suggestions || [],
      };

      const { error } = validateAnalysis(analysisData);
      if (error) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ error: error.details[0].message });
      }

      const candidate = await Candidate.findOne({ userId: req.user._id });
      if (!candidate) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: "Candidate profile not found" });
      }

      const fileData = {
        fileUrl: `/uploads/cvs/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
      };

      if (candidate.cvHistory.length >= MAX_CV_HISTORY) {
        const oldestCV = candidate.cvHistory[0];
        const oldFilePath = path.join(__dirname, "..", oldestCV.fileUrl);

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }

        candidate.cvHistory.shift();
      }

      candidate.cvHistory.push({
        ...fileData,
        uploadDate: new Date(),
        analysis: analysisData,
      });

      await candidate.save();

      res.json({
        message: "Analysis completed and CV saved",
        result: candidate.getLatestCVWithAnalysis(),
      });
    } catch (error) {
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
      console.error("Error analyzing CV:", error);
      res.status(500).json({ error: error.message });
    }
  })
);

router.post(
  "/analyze-existing-cv/:cvIndex",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: "Job description is required" });
    }

    const cvIndex = parseInt(req.params.cvIndex);
    if (isNaN(cvIndex) || cvIndex < 0) {
      return res.status(400).json({ error: "Invalid CV index" });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate || candidate.cvHistory.length <= cvIndex) {
      return res.status(404).json({ error: "Candidate or CV not found" });
    }

    const cvFilePath = path.join(
      __dirname,
      "..",
      candidate.cvHistory[cvIndex].fileUrl
    );
    if (!fs.existsSync(cvFilePath)) {
      return res.status(404).json({ error: "CV file not found" });
    }

    const analyzeCV = new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        path.join(__dirname, "../python/cv_analyzer.py"),
        cvFilePath,
        path.join(__dirname, "../Datasets/skills_and_experience.csv"),
        req.body.jobDescription,
      ]);

      let analysisResult = "";
      let errorOutput = "";

      pythonProcess.stdout.on("data", (data) => {
        analysisResult += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        console.error(`Python script error: ${data.toString()}`);
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          return reject(
            new Error(`Python script failed with code ${code}: ${errorOutput}`)
          );
        }

        if (!analysisResult.trim()) {
          return reject(new Error("No output from analysis"));
        }

        try {
          const result = JSON.parse(analysisResult);
          resolve(result);
        } catch (error) {
          reject(
            new Error(`Failed to parse analysis results: ${error.message}`)
          );
        }
      });
    });

    try {
      const result = await analyzeCV;

      result.suggestions = generateSuggestions(result);

      const analysisData = {
        similarity_score: result.similarity_score,
        skills: result.entities?.SKILL || [],
        suggestions: result.suggestions || [],
      };

      const { error } = validateAnalysis(analysisData);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      await candidate.addAnalysis(cvIndex, analysisData);

      res.json({
        message: "Analysis completed",
        result: candidate.cvHistory[cvIndex],
      });
    } catch (error) {
      console.error("Error analyzing CV:", error);
      res.status(500).json({ error: error.message });
    }
  })
);
// Get all pinned jobs
router.get(
  "/pinned-jobs",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const candidate = await Candidate.findOne({ userId: req.user._id }).populate("pinnedJobs");

    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    res.status(200).json(candidate.pinnedJobs);
  })
);
// Pin a job
router.post(
  "/pinned-jobs",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    if (candidate.pinnedJobs.includes(jobId)) {
      return res.status(400).json({ message: "Job is already pinned" });
    }

    candidate.pinnedJobs.push(jobId);
    await candidate.save();

    res.status(200).json({ message: "Job pinned successfully", pinnedJobs: candidate.pinnedJobs });
  })
);

// Unpin a job
router.delete(
  "/pinned-jobs/:jobId",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const { jobId } = req.params;

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const jobIndex = candidate.pinnedJobs.indexOf(jobId);
    if (jobIndex === -1) {
      return res.status(400).json({ message: "Job is not pinned" });
    }

    candidate.pinnedJobs.splice(jobIndex, 1);
    await candidate.save();

    res.status(200).json({ message: "Job unpinned successfully", pinnedJobs: candidate.pinnedJobs });
  })
);



// Apply to a job
// Apply to a job
router.post(
  "/apply-job",
  auth,
  checkRole(["candidate"]),
  upload.single('cv'),
  asyncHandler(async (req, res) => {
    try {
      console.log("Request received for /apply-job");

      const { jobId, coverLetter } = req.body;
      const cvPath = req.file ? req.file.path : null;

      console.log("Job ID:", jobId);
      console.log("Cover Letter:", coverLetter);
      console.log("CV Path:", cvPath);

      if (!jobId) {
        console.error("Job ID is missing");
        return res.status(400).json({ message: "Job ID is required" });
      }
      if (!cvPath) {
        console.error("CV file is missing");
        return res.status(400).json({ message: "CV is required" });
      }

      const candidate = await Candidate.findOne({ userId: req.user._id });
      if (!candidate) {
        console.error("Candidate profile not found for user ID:", req.user._id);
        return res.status(404).json({ message: "Candidate profile not found" });
      }
      console.log("Candidate found:", candidate._id);

      const job = await Job.findById(jobId).populate({
        path: "recruiterId",
        strictPopulate: false,
      });      if (!job) {
        console.error("Job not found for Job ID:", jobId);
        return res.status(404).json({ message: "Job not found" });
      }
      console.log("Job found:", job._id);

      // Check if the candidate has already applied for this job
      const existingApplication = await Application.findOne({
        candidateId: candidate._id,
        jobId: job._id,
      });

      if (existingApplication) {
        console.error("Candidate has already applied for this job:", jobId);
        return res
          .status(400)
          .json({ message: "You have already applied for this job" });
      }

      console.log("No existing application found. Proceeding to create a new one.");

      // Create a new application
      const application = new Application({
        candidateId: candidate._id,
        jobId: job._id,
        recruiterId: job.recruiterId._id,
        coverLetter: coverLetter || "",
        cvPath: cvPath, // Add this line to store the CV file path
        status: "Under Review",
      });

      await application.save();
      console.log("Application saved successfully:", application._id);

      // Increment the applicationCount for the job
      job.applicationCount = (job.applicationCount || 0) + 1;
      await job.save();
      console.log("Job application count incremented:", job.applicationCount);

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Error in /apply-job route:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  })
);
// Get application status
router.get(
  "/applications",
  auth,
  checkRole(["candidate"]),
  asyncHandler(async (req, res) => {
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) {
      return res.status(404).json({ message: "Candidate profile not found" });
    }

    const applications = await Application.find({ candidateId: candidate._id })
      .populate("jobId", "title companyName")
      .populate("recruiterId", "firstName lastName email");

    res.status(200).json({
      message: "Applications retrieved successfully",
      applications,
    });
  })
);
// Error handling middleware
router.use((err, req, res, next) => {
  console.error("Route error:", err);

  // Handle Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({
          message: `File too large. Maximum size is ${
            MAX_CV_SIZE / (1024 * 1024)
          }MB.`,
        });
    }
    return res
      .status(400)
      .json({ message: `File upload error: ${err.message}` });
  }

  res.status(500).json({ message: err.message || "Internal Server Error" });
});

module.exports = router;
