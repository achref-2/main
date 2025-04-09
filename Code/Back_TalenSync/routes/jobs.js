const router = require("express").Router();
const { Candidate } = require("../models/candidate");
const { Job } = require("../models/Job");
const { Application, validateApplication } = require("../models/Application");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
// Mock job data (replace with database query)
let jobs = [];
router.get("/", async (req, res) => {
  try {
    console.log("Fetching jobs...");
    const jobs = await Job.find({ status: "active" }).select("-applicants");
    console.log("Jobs fetched from database:", jobs); // Debugging
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/add-default-job", async (req, res) => {
  try {
    const existingJob = await Job.findOne({ title: "Default Job" });
    if (existingJob) {
      return res.status(200).json({ message: "Default job already exists.", job: existingJob });
    }

    const defaultJob = new Job({
      title: "Default Job",
      description: "This is a default job for testing purposes.",
      requirements: "Basic programming skills",
      location: "Remote",
      salary: "50,000 USD",
      jobType: "Full Time",
      skills: ["JavaScript", "Node.js", "React"],
      recruiter: "64b7f9e2f2a4e2a4b7f9e2f2", // Replace with a valid recruiter ID from your database
      companyName: "Default Company",
      status: "active",
    });

    await defaultJob.save();
    res.status(201).json({ message: "Default job added successfully", job: defaultJob });
  } catch (error) {
    console.error("Error adding default job:", error.response?.data?.message || error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/jobs", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    // Get query parameters
    const { 
      search,
      location,
      jobType,
      skills,
      category,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc"
    } = req.query;
    
    // Build filter object
    const filter = { status: "active" };
    
    // Add search query
    if (search) {
      filter.$text = { $search: search };
    }
    
    // Add location filter
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    
    // Add job type filter
    if (jobType) {
      filter.jobType = jobType;
    }
    
    // Add skills filter
    if (skills) {
      const skillsArray = skills.split(",").map(skill => skill.trim());
      filter.skills = { $in: skillsArray };
    }
    if (category) {
      filter.category = category;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Determine sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    
    // Find jobs with filters and pagination
    const jobs = await Job.find(filter)
                          .sort(sortOptions)
                          .skip(skip)
                          .limit(parseInt(limit))
                          .select("-applicants"); // Don't send applicants list for privacy
    
    // Count total jobs matching filter
    const totalJobs = await Job.countDocuments(filter);
    
    res.status(200).send({
      jobs,
      pagination: {
        total: totalJobs,
        page: parseInt(page),
        pages: Math.ceil(totalJobs / parseInt(limit))
      }
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



// Apply for a job
router.post("/jobs/:id/apply", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    const jobId = req.params.id;
    const { coverLetter } = req.body;

    if (!coverLetter) {
      return res.status(400).send({ message: "Cover letter is required" });
    }

    const job = await Job.findOne({ _id: jobId, status: "active" });
    if (!job) 
      return res.status(404).send({ message: "Job posting not found or not active" });

    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).send({ message: "Application deadline has passed" });
    }

    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) 
      return res.status(404).send({ message: "Candidate profile not found" });

    const existingApplication = await Application.findOne({ 
      jobId,
      candidateId: candidate._id
    });

    if (existingApplication) {
      return res.status(409).send({ message: "You have already applied for this job" });
    }

    const latestCV = candidate.getLatestCVWithAnalysis();
    if (!latestCV) {
      return res.status(400).send({ message: "Please upload a CV before applying for jobs" });
    }

    const application = new Application({
      jobId,
      candidateId: candidate._id,
      resumeUrl: latestCV.fileUrl,
      coverLetter,
      status: "pending",
      appliedAt: new Date()
    });

    await application.save();

    if (!job.applicants.includes(candidate._id)) {
      job.applicants.push(candidate._id);
      await job.save();
    }

    res.status(201).send({ 
      message: "Successfully applied for the job",
      application
    });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all applications for the candidate
router.get("/applications", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) 
      return res.status(404).send({ message: "Candidate profile not found" });
    
    const applications = await Application.find({ candidateId: candidate._id })
                                         .populate('jobId')
                                         .sort({ appliedAt: -1 });
    
    res.status(200).send(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get specific application details
router.get("/applications/:id", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) 
      return res.status(404).send({ message: "Candidate profile not found" });
    
    const application = await Application.findOne({ 
      _id: req.params.id,
      candidateId: candidate._id
    }).populate('jobId');
    
    if (!application) 
      return res.status(404).send({ message: "Application not found" });
    
    res.status(200).send(application);
  } catch (error) {
    console.error("Error fetching application details:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Withdraw an application
router.delete("/applications/:id", auth, checkRole(["candidate"]), async (req, res) => {
  try {
    const candidate = await Candidate.findOne({ userId: req.user._id });
    if (!candidate) 
      return res.status(404).send({ message: "Candidate profile not found" });
    
    const application = await Application.findOne({ 
      _id: req.params.id,
      candidateId: candidate._id
    });
    
    if (!application) 
      return res.status(404).send({ message: "Application not found" });
    
    // Check if application can be withdrawn (only pending or reviewed)
    if (!['pending', 'reviewed'].includes(application.status)) {
      return res.status(400).send({ 
        message: "Application cannot be withdrawn at its current status"
      });
    }
    
    // Remove candidate from job's applicants list
    await Job.updateOne(
      { _id: application.jobId },
      { $pull: { applicants: candidate._id } }
    );
    
    // Delete the application
    await Application.deleteOne({ _id: application._id });
    
    res.status(200).send({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Error withdrawing application:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;