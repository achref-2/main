const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// API endpoint for CV analysis
app.post('/api/analyze', upload.single('cv'), async (req, res) => {
  try {
    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file uploaded' });
    }
    if (!req.body.jobDescription) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    console.log('Received file path:', req.file.path);
    console.log('Received job description:', req.body.jobDescription);

    const { path: cvPath } = req.file;
    const { jobDescription } = req.body;

    // Run Python script for analysis
    const pythonProcess = spawn('python', [
      'python/cv_analyzer.py',
      cvPath,
      'Datasets/skills_and_experience.csv',
      jobDescription,
    ]);

    let analysisResult = '';

    pythonProcess.stdout.on('data', (data) => {
      analysisResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      console.log('Python script exited with code:', code);
      
      if (code !== 0) {
        return res.status(500).json({ error: 'Python script failed' });
      }

      // Check if the script output is empty
      if (!analysisResult.trim()) {
        console.error('Python script returned empty output');
        return res.status(500).json({ error: 'No output from analysis' });
      }

      console.log('Raw analysis result:', analysisResult);

      try {
        const result = JSON.parse(analysisResult);

        // Add AI-powered suggestions
        result.suggestions = generateSuggestions(result);

        res.json(result);
      } catch (error) {
        console.error('Failed to parse analysis results:', analysisResult);
        res.status(500).json({ error: 'Failed to parse analysis results' });
      }
    });
  } catch (error) {
    console.error('Error in API endpoint:', error.message);
    res.status(500).json({ error: error.message });
  }
});

function generateSuggestions(analysis) {
  const suggestions = [];
  const requiredSkills = ['python', 'machine learning', 'data analysis']; // Example skills

  // Check for missing key skills
  const missingSkills = requiredSkills.filter(
    (skill) => !analysis.entities.SKILL.map((s) => s.toLowerCase()).includes(skill)
  );

  if (missingSkills.length > 0) {
    suggestions.push(`Consider adding experience with: ${missingSkills.join(', ')}`);
  }

  // Check match score
  if (analysis.similarity_score < 0.7) {
    suggestions.push('Your CV could be better aligned with the job description. Try using more relevant keywords.');
  }

  // Education suggestions
  if (!analysis.entities.EDUCATION || analysis.entities.EDUCATION.length === 0) {
    suggestions.push('Add your educational background to strengthen your application.');
  }

  return suggestions;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});