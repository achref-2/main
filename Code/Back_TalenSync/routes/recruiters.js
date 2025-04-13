const router = require("express").Router();
const { Recruiter } = require('../models/Recruiter');
const { Job } = require("../models/Job");
const { User, validateUser } = require("../models/user");
const { Candidate } = require("../models/candidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const { OAuth2Client } = require("google-auth-library");
const { validateJob } = require("../models/Job"); // Adjust the path based on your project structure
const { Application } = require('../models/Application'); // Import the Application model

router.post("/signup", async (req, res) => {
    try {
      const { error: userError } = validateUser(req.body);
      const existingUser = await User.findOne({ email: req.body.email });
      if (userError)
        return res.status(400).send({ message: userError.details[0].message });
      if (existingUser)
        return res.status(409).send({ message: "User with this email already exists!" });
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      
      const user = new User({
        firstName: req.body.firstName,
        email: req.body.email,
        password: hashedPassword,
        role: "recruiter",
        status: "pending" 
      });
      
     
      const savedUser = await user.save();
      
      
      const recruiter = new Recruiter({
        userId: savedUser._id,
        companyName: req.body.companyName || "",
        jobPostings: [],
        approved: false 
      });
      
      await recruiter.save();
      
      res.status(201).send({
        message: "Recruiter registration successful. Your account is pending approval by an administrator.",
        user: {
          id: savedUser._id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          role: savedUser.role,
          status: savedUser.status
        }
      });
    } catch (error) {
      console.error("Error creating recruiter:", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  });

// Login for recruiters
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({ message: "Email and password are required" });

    const user = await User.findOne({ email, role: "recruiter" });
    if (!user)
      return res.status(401).send({ message: "Invalid email or password" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password" });

    const recruiter = await Recruiter.findOne({ userId: user._id });
    if (!recruiter)
      return res.status(404).send({ message: "Recruiter profile not found" });

    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        email: user.email
      },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
    );

    res.status(200).send({
      message: "Logged in successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture || null, // Include profile picture
        role: user.role
      },
      recruiterId: recruiter._id,
      companyName: recruiter.companyName
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/auth/google", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Google token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, given_name, family_name, picture, sub } = ticket.getPayload();
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        firstName: given_name,
        lastName: family_name,
        email,
        profilePicture: picture, // Save profile picture
        password: Math.random().toString(36).slice(-10),
        role: "recruiter",
        googleId: sub,
      });
      await user.save();

      const recruiter = new Recruiter({ userId: user._id });
      await recruiter.save();
    } else if (user.role !== "recruiter") {
      return res.status(403).json({ error: "Only recruiters can log in here." });
    }

    const jwtToken = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
    );

    const recruiterData = await Recruiter.findOne({ userId: user._id });

    res.json({
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture || picture, // Include profile picture
        role: user.role,
      },
      recruiterData,
    });
  } catch (error) {
    console.error("Google authentication error:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
});

// Get recruiter profile
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

// Update recruiter profile
router.put("/profile", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const { companyName } = req.body;
    
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Update fields
    if (companyName !== undefined) recruiter.companyName = companyName;
    
    await recruiter.save();
    res.status(200).send({ message: "Profile updated successfully", recruiter });
  } catch (error) {
    console.error("Error updating recruiter profile:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Create a new job posting
router.post("/jobs", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      location, 
      salary, 
      jobType, 
      deadline,
      category, // Include category here
      skills,
      experienceLevel,
      educationRequirements,
      industry,
      featured
    } = req.body;
    
    // Validate job data
    const { error } = validateJob(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    
    // Find the recruiter
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Create new job
    const job = new Job({
      title,
      description,
      requirements,
      location,
      salary,
      jobType,
      deadline: deadline ? new Date(deadline) : undefined,
      category, // Save category in the Job model
      skills: skills || [],
      recruiter: recruiter._id,
      companyName: recruiter.companyName,
      applicants: [],
      applicationCount: 0,
      viewCount: 0,
      status: "active",
      experienceLevel: experienceLevel || "Mid-level",
      educationRequirements: educationRequirements || "",
      industry: industry || "",
      featured: featured || false
    });
    
    // Save the job
    const savedJob = await job.save();
    
    // Add job to recruiter's job postings
    recruiter.jobPostings.push(savedJob._id);
    await recruiter.save();
    
    res.status(201).send({ 
      message: "Job posting created successfully",
      job: savedJob
    });
  } catch (error) {
    console.error("Error creating job posting:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Get all jobs posted by the recruiter
router.get("/jobs", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Get query params for filtering
    const { status, sort, jobType, experienceLevel, category } = req.query; // Add category here
    
    // Build query
    let query = { _id: { $in: recruiter.jobPostings } };
    if (status) query.status = status;
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (category) query.category = category; // Add category filter
    
    // Build sort options
    let sortOption = {};
    if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'deadline') sortOption = { deadline: 1 };
    else if (sort === 'applications') sortOption = { applicationCount: -1 };
    else sortOption = { createdAt: -1 }; // Default sort
    
    const jobs = await Job.find(query)
                         .sort(sortOption)
                         .populate('applicants', '-password');
    
    res.status(200).send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    console.log("Request body:", req.body);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get a specific job by ID
router.get("/jobs/:id", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });

    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Check if the job belongs to this recruiter
    if (!recruiter.jobPostings.includes(req.params.id)) {
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }
    
    const job = await Job.findById(req.params.id)
                         .populate({
                           path: 'applicants',
                           select: '-password'
                         });
    
    if (!job) 
      return res.status(404).send({ message: "Job posting not found" });
    
    // Increment view count
    job.viewCount += 1;
    await job.save();
    
    // Check if job is expired and update status if needed
    if (job.deadline < new Date() && job.status === 'active') {
      job.status = 'closed';
      await job.save();
    }
    
    res.status(200).send(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update a job posting
router.put("/jobs/:id", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const jobId = req.params.id;
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Check if the job belongs to this recruiter
    if (!recruiter.jobPostings.includes(jobId)) {
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }
    
    // Validate the update data
    const { error } = validateJob(req.body);
    if (error) return res.status(400).send({ message: error.details[0].message });
    
    const { 
      title, 
      description, 
      requirements, 
      location, 
      salary, 
      jobType, 
      deadline,
      skills,
      status,
      experienceLevel,
      educationRequirements,
      industry,
      featured
    } = req.body;
    
    // Find and update the job
    const job = await Job.findById(jobId);
    if (!job) 
      return res.status(404).send({ message: "Job posting not found" });
    
    // Update fields if provided
    if (title !== undefined) job.title = title;
    if (description !== undefined) job.description = description;
    if (requirements !== undefined) job.requirements = requirements;
    if (location !== undefined) job.location = location;
    if (salary !== undefined) job.salary = salary;
    if (jobType !== undefined) job.jobType = jobType;
    if (deadline !== undefined) job.deadline = new Date(deadline);
    if (skills !== undefined) job.skills = skills;
    if (status !== undefined) job.status = status;
    if (experienceLevel !== undefined) job.experienceLevel = experienceLevel;
    if (educationRequirements !== undefined) job.educationRequirements = educationRequirements;
    if (industry !== undefined) job.industry = industry;
    if (featured !== undefined) job.featured = featured;
    
    // Save updated job
    const updatedJob = await job.save();
    
    res.status(200).send({ 
      message: "Job posting updated successfully",
      job: updatedJob
    });
  } catch (error) {
    console.error("Error updating job posting:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete a job posting
router.delete("/jobs/:id", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("Job ID from request params:", jobId); // Debug log
    console.log("User ID from token:", req.user._id); // Debug log
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      console.error("Recruiter profile not found for user:", req.user._id);
      return res.status(404).send({ message: "Recruiter profile not found" });
    }

    console.log("Recruiter jobPostings:", recruiter.jobPostings);

    if (!recruiter.jobPostings.map(id => id.toString()).includes(jobId)) {
      console.error("Access denied. Job does not belong to recruiter:", jobId);
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      console.error("Job not found in database:", jobId);
      return res.status(404).send({ message: "Job posting not found" });
    }

    await Job.findByIdAndDelete(jobId);
    recruiter.jobPostings = recruiter.jobPostings.filter(id => id.toString() !== jobId);
    await recruiter.save();

    res.status(200).send({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get job posting statistics
router.get("/jobs/stats/overview", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Get all jobs by this recruiter
    const jobs = await Job.find({ recruiter: recruiter._id });
    
    // Calculate statistics
    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(job => job.status === 'active').length,
      closedJobs: jobs.filter(job => job.status === 'closed').length,
      draftJobs: jobs.filter(job => job.status === 'draft').length,
      totalApplications: jobs.reduce((sum, job) => sum + job.applicationCount, 0),
      totalViews: jobs.reduce((sum, job) => sum + job.viewCount, 0),
      featuredJobs: jobs.filter(job => job.featured).length,
      jobsByType: {},
      jobsByExperience: {},
      mostViewedJobs: jobs.sort((a, b) => b.viewCount - a.viewCount).slice(0, 5),
      mostAppliedJobs: jobs.sort((a, b) => b.applicationCount - a.applicationCount).slice(0, 5)
    };
    
    // Count jobs by type
    jobs.forEach(job => {
      if (!stats.jobsByType[job.jobType]) stats.jobsByType[job.jobType] = 0;
      stats.jobsByType[job.jobType]++;
      
      if (!stats.jobsByExperience[job.experienceLevel]) stats.jobsByExperience[job.experienceLevel] = 0;
      stats.jobsByExperience[job.experienceLevel]++;
    });
    
    res.status(200).send(stats);
  } catch (error) {
    console.error("Error fetching job statistics:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Feature/unfeature a job
router.patch("/jobs/:id/feature", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const jobId = req.params.id;
    const { featured } = req.body;
    
    if (featured === undefined) {
      return res.status(400).send({ message: "Featured status is required" });
    }
    
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Check if the job belongs to this recruiter
    if (!recruiter.jobPostings.includes(jobId)) {
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }
    
    // Update the featured status
    const job = await Job.findByIdAndUpdate(
      jobId,
      { featured: featured },
      { new: true }
    );
    
    if (!job) return res.status(404).send({ message: "Job posting not found" });
    
    res.status(200).send({ 
      message: featured ? "Job has been featured" : "Job has been unfeatured",
      job: job
    });
  } catch (error) {
    console.error("Error updating job featured status:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Get all candidates who applied to a specific job
router.get("/jobs/:id/applicants", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("Job ID from request params:", jobId);
    console.log("User ID from token:", req.user._id);
    console.log("Connected to database successfully");

    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      console.error("Recruiter profile not found for user:", req.user._id);
      return res.status(404).send({ message: "Recruiter profile not found" });
    }

    console.log("Recruiter jobPostings:", recruiter.jobPostings.map(posting => posting.toString()));

    const job = await Job.findById(jobId);
    if (!job) {
      console.error("Job not found in database:", jobId);
      return res.status(404).send({ message: "Job posting not found" });
    }

    console.log("Job applicants:", job.applicants.map(applicant => applicant.toString()));

    const candidates = await Candidate.find({ _id: { $in: job.applicants } })
                                     .populate('userId', '-password');

    const formattedCandidates = candidates.map(candidate => {
      const education = candidate.education.map(edu => {
        const degree = edu.degree || "Unknown Degree";
        const field = edu.fieldOfStudy || "Unknown Field";
        const institution = edu.institution || "Unknown Institution";
        return `${degree} in ${field} from ${institution}`;
      }).join(", ") || "N/A";

      const experience = candidate.experience.map(exp => {
        const title = exp.title || "Unknown Title";
        const company = exp.company || "Unknown Company";
        const startDate = exp.startDate || "Unknown Start Date";
        const endDate = exp.endDate || "Present";
        return `${title} at ${company} (${startDate} - ${endDate})`;
      }).join(", ") || "N/A";

      return {
        id: candidate._id,
        name: candidate.userId?.firstName || "N/A",
        email: candidate.userId?.email || "N/A",
        phone: candidate.personalInfo?.phone || "N/A",
        location: candidate.personalInfo?.location || "N/A",
        skills: candidate.skills.filter(skill => skill).join(", ") || "N/A",
        certifications: candidate.certifications.filter(cert => cert).join(", ") || "N/A",
        education,
        experience,
        coverLetter: candidate.coverLetter || "N/A",
        pinnedJobs: candidate.pinnedJobs.map(job => job.toString()).join(", ") || "N/A"
      };
    });

    console.log("Formatted Candidates:", formattedCandidates);

    res.status(200).send(formattedCandidates);
  } catch (error) {
    console.error("Error fetching applicants:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});
// Update application status for a candidate
router.put("/jobs/:jobId/applicants/:candidateId", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const { jobId, candidateId } = req.params;
    const { status, feedback } = req.body;
    
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Check if the job belongs to this recruiter
    if (!recruiter.jobPostings.includes(jobId)) {
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }
    
    const job = await Job.findById(jobId);
    if (!job) 
      return res.status(404).send({ message: "Job posting not found" });
    
    // Check if the candidate has applied to this job
    if (!job.applicants.includes(candidateId)) {
      return res.status(404).send({ message: "Candidate has not applied to this job" });
    }
    
    // Update application status in applications collection
    // Note: This assumes you have an Application model. If not, you'll need to adjust this.
    const application = await Application.findOne({ jobId, candidateId });
    if (!application) {
      return res.status(404).send({ message: "Application not found" });
    }
    
    application.status = status;
    if (feedback) application.feedback = feedback;
    await application.save();
    
    res.status(200).send({ 
      message: "Application status updated successfully",
      application
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get dashboard statistics for recruiter
router.get("/dashboard", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Get all jobs
    const jobs = await Job.find({ _id: { $in: recruiter.jobPostings } });
    
    // Calculate statistics
    const activeJobs = jobs.filter(job => job.status === "active").length;
    const closedJobs = jobs.filter(job => job.status === "closed").length;
    const totalApplicants = jobs.reduce((total, job) => total + job.applicants.length, 0);
    
    // Get recent applications
    // Note: This assumes you have an Application model. If not, you'll need to adjust this.
    const recentApplications = await Application.find({ jobId: { $in: recruiter.jobPostings } })
                                              .sort({ createdAt: -1 })
                                              .limit(5)
                                              .populate('candidateId', 'userId')
                                              .populate('jobId', 'title');
    
    res.status(200).send({
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        closedJobs,
        totalApplicants
      },
      recentApplications
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all candidates who applied to the recruiter's jobs
router.get("/candidates/applied", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    console.log("Fetching all candidates who applied to all jobs of the recruiter");

    // Fetch the recruiter profile
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    if (!recruiter) {
      console.error("Recruiter profile not found for user:", req.user._id);
      return res.status(404).send({ message: "Recruiter profile not found" });
    }

    console.log("Recruiter profile found:", recruiter);

    // Fetch all applications for the recruiter's jobs
    const applications = await Application.find({ recruiterId: recruiter._id })
      .populate("candidateId", "personalInfo.name personalInfo.email personalInfo.phone personalInfo.location skills certifications education experience coverLetter latestAnalysis cvHistory")
      .populate("jobId", "title location salary skills requirements jobType deadline companyName");

    console.log("Applications fetched:", applications);

    if (applications.length === 0) {
      console.warn("No applications found for the recruiter's jobs.");
      return res.status(404).send({ message: "No applications found for the recruiter's jobs" });
    }

    // Map applications to candidate and job details
    const candidates = applications.map(application => {
      const candidate = application.candidateId;
      const job = application.jobId;
      return {
        id: candidate._id,
        name: candidate.personalInfo?.name || "N/A",
        email: candidate.personalInfo?.email || "N/A",
        phone: candidate.personalInfo?.phone || "N/A",
        location: candidate.personalInfo?.location || "N/A",
        skills: candidate.skills?.join(", ") || "N/A",
        certifications: candidate.certifications?.join(", ") || "N/A",
        education: candidate.education?.map(edu => `${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}`).join(", ") || "N/A",
        experience: candidate.experience?.map(exp => `${exp.title} at ${exp.company} (${exp.period})`).join(", ") || "N/A",
        coverLetter: candidate.coverLetter || "N/A",
        latestAnalysis: candidate.latestAnalysis || {},
        cvHistory: candidate.cvHistory || [],
        cvPath: application.cvPath, // Include CV file path
        appliedJob: {
          id: job._id,
          title: job.title,
          location: job.location || "N/A",
          salary: job.salary || "N/A",
          skills: job.skills?.join(", ") || "N/A",
          requirements: job.requirements || "N/A",
          jobType: job.jobType || "N/A",
          deadline: job.deadline || "N/A",
          companyName: job.companyName || "N/A",
        },
        appliedAt: application.appliedAt,
      };
    });

    res.status(200).send(candidates);
  } catch (error) {
    console.error("Error fetching candidates for recruiter's jobs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;