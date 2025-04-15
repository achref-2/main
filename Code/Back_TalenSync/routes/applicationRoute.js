const express = require('express');
const auth = require('../middleware/auth'); // Ensure the correct path to your auth middleware
const checkRole = require('../middleware/checkRole'); // Ensure the correct path to your role-check middleware
const { Candidate } = require('../models/candidate'); // Import Candidate model
const { Application } = require('../models/Application');
const multer = require('multer');
const { Job } = require("../models/Job");
const { spawn } = require('child_process'); // Ensure child_process is imported
const os = require('os'); // Added the missing import for the 'os' module

const router = express.Router();
const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in 'uploads/' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file names
  },
});
const upload = multer({ storage });


router.post('/generate-cover-letter', upload.single('resumeAnalysis'), async (req, res) => {
  try {
    console.log("🔥 POST /generate-cover-letter hit");

    let resumeAnalysisPath = null;
    let jobDetailsText = req.body.jobDetailsText || null;
    let jobDetailsPath = null;

    console.log("📄 Received jobDetailsText:", jobDetailsText?.slice(0, 100));
    console.log("📁 req.file:", req.file);

    if (req.file) {
      resumeAnalysisPath = req.file.path;
      console.log("📄 resumeAnalysisPath:", resumeAnalysisPath);
    }

    if (jobDetailsText) {
      const tempFilePath = path.join(os.tmpdir(), `job-details-${Date.now()}.txt`);
      fs.writeFileSync(tempFilePath, jobDetailsText);
      jobDetailsPath = tempFilePath;
      console.log("📄 jobDetailsPath:", jobDetailsPath);
    }

    if (!resumeAnalysisPath) {
      return res.status(400).json({ error: 'Resume analysis file is required.' });
    }

    if (!jobDetailsPath) {
      return res.status(400).json({ error: 'Job details text is required.' });
    }

    const scriptArgs = ['python/generateCoverLetter.py', resumeAnalysisPath, jobDetailsPath];
    console.log("🚀 Running script with args:", scriptArgs);

    const pythonProcess = spawn('python', scriptArgs);

    let extractionResult = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      extractionResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (jobDetailsPath) fs.unlinkSync(jobDetailsPath);
      console.log("✅ Python exited with code:", code);
      console.log("📤 stdout:", extractionResult);
    

      if (code !== 0) {
        return res.status(500).json({
          error: 'Python script failed',
          details: errorOutput.trim() || 'Unknown error occurred',
          exitCode: code
        });
      }

      try {
        let jsonMatch = extractionResult.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          return res.json({ result: { coverLetter: extractionResult.trim() } });
        }

        let cleanedResult = jsonMatch[0]
          .replace(/}\s*{/g, ',')
          .replace(/\]\s*\[/g, ',')
          .replace(/,,+/g, ',')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']');

        const result = JSON.parse(cleanedResult);

        // Save the cover letter to the candidate's profile
        const candidateId = req.body.candidateId; // Assuming candidateId is sent in the request body
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
          return res.status(404).json({ error: 'Candidate not found' });
        }

        candidate.coverLetter = result.coverLetter || extractionResult.trim();
        await candidate.save();

        res.json({
          message: 'Cover letter generated and saved successfully',
          result,
        });
      } catch (error) {
        console.error("⚠️ JSON parse error:", error.message);
        res.status(500).json({
          error: 'Failed to process extraction results',
          details: error.message,
          rawOutput: extractionResult
        });
      }
    });

    pythonProcess.on('error', (err) => {
      console.error("🔥 Failed to spawn python:", err.message);
      res.status(500).json({ error: 'Failed to start Python process', details: err.message });
    });

  } catch (error) {
    console.error("🔥 Unhandled server error:", error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Add the /apply-job route
router.post('/apply-job', auth, checkRole(['candidate']), upload.single('cv'), async (req, res) => {
  try {
    console.log('Request received for /apply-job');

    const { jobId, level, coverLetter: userCoverLetter } = req.body;

    // Process the uploaded CV file using the same logic as /api/TakeData
    if (!req.file) {
      return res.status(400).json({
        error: 'No CV file uploaded',
        details: 'Ensure file is sent with key "cv"',
      });
    }

    console.log('File received:', req.file);

    const cvPath = req.file.path;
    const pythonProcess = spawn('python', ['python/ExtractData.py', cvPath]);

    let extractionResult = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      extractionResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Python script error: ${data.toString()}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        return res.status(500).json({
          error: 'Python script failed',
          details: errorOutput.trim(),
        });
      }

      try {
        console.log('Raw Extraction Result:', extractionResult);

        let jsonMatch = extractionResult.match(/\{[\s\S]*\}/);
        let cleanedResult = jsonMatch ? jsonMatch[0] : '{}';

        cleanedResult = cleanedResult
          .replace(/}\s*{/g, ',')
          .replace(/]\s*\[/g, ',')
          .replace(/,,+/g, ',');

        let result = JSON.parse(cleanedResult);

        console.log('Parsed Extraction Result:', result);

        // Save the extracted result to the candidate's profile
        const candidate = await Candidate.findOne({ userId: req.user._id });
        if (!candidate) {
          return res.status(404).json({ message: 'Candidate profile not found' });
        }

        // Ensure similarity_score is present
        if (!result.similarity_score) {
          result.similarity_score = 0.5; // Default value if missing
        }

        candidate.latestAnalysis = {
          similarity_score: result.similarity_score,
          skills: result.skills || [],
          suggestions: result.suggestions || [],
          analyzedAt: new Date(),
        };
        await candidate.save();

        console.log('Saved extraction result to candidate profile:', candidate._id);

        // Fetch job and recruiter
        const job = await Job.findOne({ _id: jobId, status: 'active' }).populate({ path: 'recruiter', strictPopulate: false });
        if (!job) return res.status(404).json({ message: 'Job posting not found or not active' });

        console.log('Job found:', {
          id: job._id,
          title: job.title,
          recruiter: job.recruiter?.companyName || 'N/A',
        });

        // Check deadline
        if (job.deadline && new Date() > new Date(job.deadline)) {
          console.error('Application deadline has passed for job:', jobId);
          return res.status(400).json({ message: 'Application deadline has passed' });
        }

        // Check existing application
        const existingApplication = await Application.findOne({
          candidateId: candidate._id,
          jobId: job._id,
        });
        if (existingApplication) {
          console.error('Candidate has already applied for this job:', jobId);
          return res.status(409).json({ message: 'You have already applied for this job' });
        }

        console.log('No existing application found. Proceeding to create a new one.');

        // Use provided cover letter or default from candidate
        let finalCoverLetter = userCoverLetter || candidate.coverLetter || 'N/A';

        // Create application
        const application = new Application({
          candidateId: candidate._id,
          jobId: job._id,
          recruiterId: job.recruiter?._id, // Set recruiterId
          coverLetter: finalCoverLetter,
          cvPath,
          file: cvPath,
          score: 0,
          date: new Date(),
          title: job.title,
          level: level || 'JUNIOR',
          status: 'Pending',
        });

        await application.save();
        console.log('Application saved successfully:', {
          id: application._id,
          candidateId: application.candidateId,
          jobId: application.jobId,
          recruiterId: application.recruiterId,
        });

        // Update job with new applicant
        job.applicationCount = (job.applicationCount || 0) + 1;
        if (!job.applicants.includes(candidate._id)) {
          job.applicants.push(candidate._id);
        }

        // Add application ID to jobApplications
        if (!job.jobApplications) {
          job.jobApplications = [];
        }
        job.jobApplications.push(application._id);

        await job.save();

        console.log('Job updated with new applicant:', {
          jobId: job._id,
          applicationCount: job.applicationCount,
          applicants: job.applicants.map(applicant => applicant.toString()),
          jobApplications: job.jobApplications.map(app => app.toString()),
        });

        res.status(201).json({
          message: 'Application submitted successfully',
          application,
        });
      } catch (error) {
        console.error('Failed to parse extraction results:', error.message);
        res.status(500).json({
          error: 'Failed to parse extraction results',
          details: error.message,
        });
      }
    });
  } catch (error) {
    console.error('Error in /apply-job route:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.put('/applications/:applicationId/status',auth, checkRole(['recruiter']), async (req, res) => {
  try {
    const { applicationId } = req.params;
    let { status } = req.body;

    console.log('Received applicationId:', applicationId); // Debugging log
    console.log('Received status:', status); // Debugging log

    // Normalize status to match enum values (case-insensitive comparison)
    const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Review', 'Approve', 'Reject'];
    const normalizedStatus = validStatuses.find(
      (validStatus) => validStatus.toLowerCase() === status.toLowerCase()
    );

    if (!normalizedStatus) {
      console.warn('Invalid status value:', status); // Debugging log
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      console.warn('Application not found for ID:', applicationId); // Debugging log
      return res.status(404).json({ message: 'Application not found' });
    }

    console.log('Found application:', application); // Debugging log

    application.status = normalizedStatus; // Use the normalized status
    await application.save();

    console.log('Updated application status to:', normalizedStatus); // Debugging log

    return res.status(200).json({ message: 'Application status updated successfully', application });
  } catch (error) {
    console.error('Error updating application status:', error); // Debugging log
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;