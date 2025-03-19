const router = require("express").Router();
const Recruiter = require('../models/Recruiter'); 
const { Job } = require("../models/Job");
const { User, validateUser } = require("../models/user");
const { Candidate } = require("../models/candidate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

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
    // Validate login credentials
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({ message: "Email and password are required" });
    
    // Find user by email
    const user = await User.findOne({ email, role: "recruiter" });
    if (!user)
      return res.status(401).send({ message: "Invalid email or password" });
    
    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(401).send({ message: "Invalid email or password" });
    
    // Check if there's a corresponding recruiter profile
    const recruiter = await Recruiter.findOne({ userId: user._id });
    if (!recruiter)
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        _id: user._id, 
        role: user.role,
        email: user.email
      },
      process.env.JWTPRIVATEKEY,
      { expiresIn: "7d" }
    );
    
    // Send response with token and user info
    res.status(200).send({
      message: "Logged in successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        
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

// Get recruiter profile
router.get("/profile", auth, checkRole(["recruiter"]), async (req, res) => {
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
      skills
    } = req.body;
    
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
      skills: skills || [],
      recruiter: recruiter._id,
      companyName: recruiter.companyName,
      applicants: [],
      status: "active"
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
    
    const jobs = await Job.find({ _id: { $in: recruiter.jobPostings } })
                         .populate('applicants', '-password');
    
    res.status(200).send(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
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
    
    const { 
      title, 
      description, 
      requirements, 
      location, 
      salary, 
      jobType, 
      deadline,
      skills,
      status
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
    const recruiter = await Recruiter.findOne({ userId: req.user._id });
    
    if (!recruiter) 
      return res.status(404).send({ message: "Recruiter profile not found" });
    
    // Check if the job belongs to this recruiter
    if (!recruiter.jobPostings.includes(jobId)) {
      return res.status(403).send({ message: "Access denied. This job posting doesn't belong to you." });
    }
    
    // Delete the job
    await Job.findByIdAndDelete(jobId);
    
    // Remove job from recruiter's job postings
    recruiter.jobPostings = recruiter.jobPostings.filter(id => id.toString() !== jobId);
    await recruiter.save();
    
    res.status(200).send({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error("Error deleting job posting:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Get all candidates who applied to a specific job
router.get("/jobs/:id/applicants", auth, checkRole(["recruiter"]), async (req, res) => {
  try {
    const jobId = req.params.id;
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
    
    // Get candidates who applied to this job
    const candidates = await Candidate.find({ _id: { $in: job.applicants } })
                                     .populate('userId', '-password');
    
    res.status(200).send(candidates);
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

module.exports = router;