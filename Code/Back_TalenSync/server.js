require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require('multer');
const connection = require("./db");
const checkRole = require("./middleware/checkRole");
const cvRoutes = require("./routes/cv");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const candidateRoutes = require("./routes/candidates");
const recruitersRoutes = require("./routes/recruiters");
const applicationRoutes=require("./routes/applicationRoute");
const { Application } = require("./models/Application");
const jobsRouter = require("./routes/jobs");
const Joi = require("joi");
const { User } = require("./models/user"); // Fixed import for User model
const { Candidate, validateAnalysis, validateCV } = require("./models/candidate"); // Proper import with named exports
const { Recruiter } = require("./models/Recruiter");
const adminRoutes = require("./routes/admins");
const auth = require("./middleware/auth");
const pdfParse = require('pdf-parse');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken"); // Added missing jwt import


const fs = require('fs');
const path = require('path');
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
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
const { spawn } = require('child_process');
// Initialize Express app
const app = express();

// Environment validation
const envSchema = Joi.object({
    PORT: Joi.number().required(),
    MONGODB_URI: Joi.string().required(),
    JWTPRIVATEKEY: Joi.string().required(),
}).unknown();

const { error } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Environment variable validation error: ${error.message}`);
}

connection();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
}));

// Auth & User Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cvs", cvRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/recruiters", recruitersRoutes);
app.use("/api/admin", adminRoutes);  
app.use("/api/jobs", jobsRouter);

app.use("/api/applications", applicationRoutes);


app.get('/api/cv-history', auth, async (req, res) => {
  try {
      if (!req.user) {
          console.log("Unauthorized request: No user found");
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const candidate = await Candidate.findOne({ userId: req.user._id });
      if (!candidate) {
          console.log(`Candidate not found for user ID: ${req.user._id}`);
          return res.status(404).json({ error: 'Candidate not found' });
      }

      const history = candidate.cvHistory.map(cv => ({
          fileName: cv.fileName,
          fileSize: cv.fileSize,
          fileType: cv.fileType,
          uploadDate: cv.uploadDate,
          hasAnalysis: !!cv.analysis
      }));

      console.log(`Fetched ${history.length} CV records for user ID: ${req.user._id}`);
      res.status(200).json(history);
  } catch (error) {
      console.error('Error fetching CV history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/api/auth/google", async (req, res) => {
    try {
      const { token, role = "candidate" } = req.body; // Accept role from request or default to candidate
  
      if (!token) {
        return res.status(400).json({ error: "Google token is required" });
      }
    
     console.log(" user "+role);
      if (!["candidate", "recruiter", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
  
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
  
      const { email, given_name, family_name, sub } = ticket.getPayload();
      let user = await User.findOne({ email });
  
      if (!user) {
        // Create a new user with the specified role
        user = new User({
          firstName: given_name,
          lastName: family_name,
          email,
          password: Math.random().toString(36).slice(-10),
          role: role,
          googleId: sub
        });
        await user.save();
        
        // Create role-specific profile
        if (role === "candidate") {
          const candidate = new Candidate({ userId: user._id });
          await candidate.save();
        } else if (role === "recruiter") {
          const recruiter = new Recruiter({ userId: user._id });
          await recruiter.save();
        }
      }
  
      const jwtToken = user.generateAuthToken();
  
      // Get role-specific data
      let roleData = null;
      if (user.role === "candidate") {
        roleData = await Candidate.findOne({ userId: user._id });
      } else if (user.role === "recruiter") {
        roleData = await Recruiter.findOne({ userId: user._id });
      }
  
      res.json({ 
        token: jwtToken, 
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        roleData
      });
    } catch (error) {
      console.error("Google authentication error:", error);
      res.status(400).json({ error: "Invalid Google token" });
    }
});



// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || "Internal Server Error",
    });
});
app.post('/api/TakeData', auth, upload.single('cv'), async (req, res) => {
  try {
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
          .replace(/\]\s*\[/g, ',')
          .replace(/,,+/g, ',');

        let result = JSON.parse(cleanedResult);

        console.log('Parsed Extraction Result:', result);

        // Save extracted data to the database for the current candidate
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const candidate = await Candidate.findOne({ userId: req.user._id });
        if (!candidate) {
          return res.status(404).json({ error: 'Candidate not found' });
        }

        candidate.cvHistory = candidate.cvHistory || [];
        candidate.cvHistory.push({
          fileUrl: req.file.path, // Added fileUrl field
          fileName: req.file.filename,
          fileSize: req.file.size,
          fileType: req.file.mimetype,
          uploadDate: new Date(),
          analysis: result,
        });

        await candidate.save();

        res.json({
          message: 'Extraction completed successfully and saved to database',
          result,
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
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Server processing error',
      details: error.message,
    });
  }
});
app.post('/api/AnalyseData', async (req, res) => {
  try {
    const { cvData, jobTitle, companyName, description } = req.body;
    
    // Validate input
    if (!cvData) {
      return res.status(400).json({
        error: 'No CV data received',
        details: 'Ensure you send CV data from /api/TakeData.',
      });
    }
    
    if (!jobTitle || !companyName) {
      return res.status(400).json({
        error: 'Job details missing',
        details: 'Ensure jobTitle and companyName are included in the request body.',
      });
    }
    
    // Construct job description
    const jobDescription = `${jobTitle} at ${companyName}${description ? `: ${description}` : ' (No description provided)'}`;
    console.log('Job Description:', jobDescription);
    
    // Check if cvData is an object and not a string path
    // If it's the extracted text, we need to create a temporary file
    let tempFilePath = null;
    let pdfPath = null;
    
    if (typeof cvData === 'object') {
      // If cvData contains the extracted text content instead of a file path,
      // we need to use that directly in the Python script
      
      // Since our Python script expects a path, we'll need to modify our approach
      // Option 1: Pass the extracted text directly as a parameter
      const pythonProcess = spawn('python', [
        'python/Extract._analyse.py',
        jobDescription,
        JSON.stringify(cvData)  // Pass the data directly, making sure it's a string
      ]);
      
      let analysisResult = '';
      let errorOutput = '';
      
      pythonProcess.stdout.on('data', (data) => {
        analysisResult += data.toString();
        console.log('Python Script Output:', data.toString());
      });
      
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Python script error: ${data.toString()}`);
      });
      
      pythonProcess.on('close', async (code) => {
        if (code !== 0) {
          console.error('Python process exited with code:', code);
          return res.status(500).json({
            error: 'Python script execution failed',
            details: errorOutput.trim(),
          });
        }
        
        try {
          console.log('Raw Analysis Result:', analysisResult);
          
          // Try to parse the entire output as JSON first
          try {
            const result = JSON.parse(analysisResult.trim());
            console.log('Parsed Analysis Result:', result);
            
            res.json({
              message: 'Analysis completed successfully',
              result,
            });
          } catch (parseError) {
            // If that fails, try to extract JSON from the output
            let jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
            let cleanedResult = jsonMatch ? jsonMatch[0] : '{}';
            
            let result = JSON.parse(cleanedResult);
            
            console.log('Parsed Analysis Result:', result);
            
            res.json({
              message: 'Analysis completed successfully',
              result,
            });
          }
        } catch (error) {
          console.error('Failed to parse analysis results:', error.message);
          res.status(500).json({
            error: 'Failed to parse analysis results',
            details: error.message,
          });
        }
      });
    } else {
      // Assume it's a file path
      pdfPath = cvData;
      
      // Same Python process spawn code as above but using pdfPath
      // (this branch is unlikely to be taken based on your current setup)
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      error: 'Server processing error',
      details: error.message,
    });
  }
});

app.post('/api/analyze', upload.single('cv'), async (req, res) => {
  try {
    console.log('Analyzing CV...');
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    const cvPath = req.file.path;
    const pythonProcess = spawn('python', [
      'python/cv_analyzer.py',
      cvPath,
      'Datasets/skills_and_experience.csv',
      req.body.jobDescription,
    ]);

    let analysisResult = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      analysisResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Python script error: ${data.toString()}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python process exited with code:', code);
        console.error('Error output:', errorOutput);
        return res.status(500).json({ 
          error: 'Python script failed', 
          details: errorOutput 
        });
      }

      if (!analysisResult.trim()) {
        return res.status(500).json({ error: 'No output from analysis' });
      }

      try {
        // Clean up potentially malformed JSON before parsing
        let jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
        let cleanedResult = jsonMatch ? jsonMatch[0] : analysisResult;
        
        // Try to fix common JSON structural issues
        cleanedResult = cleanedResult
          .replace(/}\s*{/g, ',')
          .replace(/\]\s*\[/g, ',')
          .replace(/\]\s*\]/g, ']]')
          .replace(/,,+/g, ',');
          
        console.log('Attempting to parse:', cleanedResult);
        let result = JSON.parse(cleanedResult);
        
        // Generate suggestions based on analysis
        result.suggestions = generateSuggestions(result);

        // No validation needed since we're not saving to a database
        // Just return the results directly
        res.json({ 
          message: 'Analysis completed successfully', 
          result 
        });
      } catch (error) {
        console.error('Failed to parse analysis results. Error:', error.message);
        console.error('Raw output:', analysisResult);
        res.status(500).json({ 
          error: 'Failed to parse analysis results', 
          details: error.message 
        });
      }
    });
  } catch (error) {
    console.error('Error in API endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});



function generateSuggestions(analysis) {
  const suggestions = [];
  const requiredSkills = ['python', 'machine learning', 'data analysis'];
  
  // Check for missing skills
  if (analysis.entities?.SKILL) {
    const candidateSkills = analysis.entities.SKILL.map(s => s.toLowerCase());
    const missingSkills = requiredSkills.filter(
      (skill) => !candidateSkills.includes(skill)
    );

    if (missingSkills.length > 0) {
      suggestions.push(`Consider adding experience with: ${missingSkills.join(', ')}`);
    }
  }

  // Check similarity score (ensure it's not negative)
  const similarityScore = Math.max(0, analysis.similarity_score || 0);
  if (similarityScore < 0.7) {
    suggestions.push('Your CV could be better aligned with the job description. Try using more relevant keywords.');
  }

  // Check for education information
  if (!analysis.entities?.EDUCATION || analysis.entities.EDUCATION.length === 0) {
    suggestions.push('Add your educational background to strengthen your application.');
  }

  return suggestions;
}

// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}...`);
});