const express = require('express');
const router = express.Router();
const CV = require('../models/Cv');
const auth = require("../middleware/auth");
const multer = require('multer'); // Ensure multer is imported
const path = require('path');
const fs = require('fs');

// Define storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${req.user._id}_${Date.now()}_cv.pdf`;
    cb(null, uniqueSuffix);
  }
});

const upload = multer({ storage });

router.post('/AddCv', auth, upload.single('cv'), async (req, res) => {
  try {
    console.log('req.file:', req.file); // Check if req.file is populated
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No CV file uploaded',
      });
    }

    console.log('Uploaded file details:', {
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    });

    // Check if user is a candidate
    if (req.user.role !== 'candidate') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only candidates can upload CVs',
      });
    }

    const cvFile = req.file;

    // Validate file type (PDF only)
    if (cvFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are accepted',
      });
    }

    // Validate file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (cvFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 10MB limit',
      });
    }

    // Create a new CV document
    const cv = new CV({
      user: req.user._id,
      originalName: cvFile.originalname,
      filename: cvFile.filename,
      path: `/uploads/cvs/${cvFile.filename}`,
      size: cvFile.size,
      mimeType: cvFile.mimetype,
      isActive: true, // Set as the active CV
    });

    // Save the CV document
    await cv.save();

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'CV uploaded successfully',
      cv: {
        id: cv._id,
        filename: cv.filename,
        originalName: cv.originalName,
        uploadDate: cv.uploadDate,
        size: cv.size,
        isActive: cv.isActive,
      },
    });
  } catch (error) {
    console.error('Error in AddCv route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading CV',
      error: error.message,
    });
  }
});

module.exports = router;