require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require('multer');
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const candidateRoutes = require("./routes/candidates");
const recruitersRoutes = require("./routes/recruiters");
const jobsRouter = require("./routes/jobs");
const Joi = require("joi");
const { User } = require("./models/user"); // Fixed import for User model
const { Candidate, validateAnalysis, validateCV } = require("./models/candidate"); // Proper import with named exports
const Recruiter = require("./models/Recruiter");
const cvRoutes = require('./routes/cv');
const adminRoutes = require("./routes/admins");
const auth = require("./middleware/auth");
const pdfParse = require('pdf-parse');
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken"); // Added missing jwt import


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
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
}));

// Auth & User Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/recruiters", recruitersRoutes);
app.use("/api/admin", adminRoutes);  
app.use("/api/jobs", jobsRouter);


app.use('/api', cvRoutes);
app.post('/api/upload-cv', auth, upload.single('cv'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CV file uploaded' });
        }

        // Validate the file
        const fileData = {
            fileName: req.file.originalname,
            fileSize: req.file.size,
            fileType: req.file.mimetype
        };
        
        const { error } = validateCV(fileData);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const candidateId = req.user._id; // Authenticated user ID
        
        // Find or create candidate profile
        let candidate = await Candidate.findOne({ userId: candidateId });
        if (!candidate) {
            candidate = new Candidate({ userId: candidateId });
        }
        
        // Add CV to history using the method from the schema
        const cvData = {
            fileData: fs.readFileSync(req.file.path),
            fileName: req.file.originalname,
            fileType: req.file.mimetype,
            fileSize: req.file.size,
        };
        
        await candidate.addCVToHistory(cvData);

        res.status(200).json({
            message: 'CV uploaded successfully',
            cvInfo: candidate.getLatestCVWithAnalysis()
        });

    } catch (error) {
        console.error('Error uploading CV:', error);
        res.status(500).json({ error: 'Failed to upload CV' });
    }
});

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
        } else if (role === "recruite") {
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


app.post("/api/save-analysis", auth, async (req, res) => {
    try {
      const { similarity_score, skills, suggestions, cvIndex } = req.body;
      
      // Validate analysis data
      const { error } = validateAnalysis({
        similarity_score,
        skills: skills || [],
        suggestions: suggestions || []
      });
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }
      
      // Find candidate
      const candidate = await Candidate.findOne({ userId: req.user._id });
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }
      
      // Determine which CV to update
      const index = cvIndex !== undefined ? cvIndex : candidate.cvHistory.length - 1;
      if (index < 0 || index >= candidate.cvHistory.length) {
        return res.status(400).json({ error: "Invalid CV index" });
      }
      
      // Add analysis to CV
      await candidate.addAnalysis(index, {
        similarity_score,
        skills,
        suggestions
      });
      
      res.status(201).json({ message: "Analysis saved successfully!" });
    } catch (error) {
      console.error("Error saving analysis:", error);
      res.status(500).json({ error: "Error saving analysis" });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || "Internal Server Error",
    });
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