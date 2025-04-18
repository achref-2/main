const mongoose = require("mongoose");
const Joi = require("joi");

const cvAnalysisSchema = new mongoose.Schema({
  similarity_score: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  skills: [{ type: String, trim: true }],
  suggestions: [{ type: String, trim: true }],
  analyzedAt: {
    type: Date,
    default: Date.now,
  },
});

// CV History Schema
const cvHistorySchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String, // Store URL instead of binary data
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    analysis: {
      type: Object, // Updated to store the analysis result as a generic object
      default: null,
    },
  },
  { timestamps: true } // Enables createdAt & updatedAt
);

// Candidate Schema
const candidateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    personalInfo: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      location: { type: String, trim: true },
      summary: { type: String, trim: true },
    },
    profilePic: {
      type: String, // Store the URL of the profile picture
      default: null, // Default to null if no profile picture is uploaded
    },
    experience: [
      {
        title: { type: String, trim: true },
        company: { type: String, trim: true },
        location: { type: String, trim: true },
        period: { type: String, trim: true },
        responsibilities: [{ type: String, trim: true }],
      },
    ],
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        location: { type: String, trim: true },
        period: { type: String, trim: true },
      },
    ],
    skills: [{ type: String, trim: true }],
    certifications: [{ type: String, trim: true }],
    cvHistory: [cvHistorySchema],
    latestAnalysis: {
      type: cvAnalysisSchema,
      default: null,
    },
    pinnedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }], // Add pinnedJobs field
    coverLetter: {
      type: String,
      trim: true,
      default: null,
    },
    draft: {
      type: Object, // Store draft data as a generic object
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
candidateSchema.index({ userId: 1 });
candidateSchema.index({ "cvHistory.uploadDate": -1 }, { sparse: true });

// Method to add CV to history
candidateSchema.methods.addCVToHistory = function (file) {
  if (this.cvHistory.length >= 10) {
    this.cvHistory.shift(); // Remove the oldest entry
  }

  const newCV = {
    fileUrl: file.path, // Use file.path for the URL
    fileName: file.originalname,
    fileSize: file.size,
    fileType: file.mimetype,
    uploadDate: new Date(),
  };

  this.cvHistory.push(newCV);

  return this.save();
};

// Method to add analysis to CV
candidateSchema.methods.addAnalysis = async function (cvIndex, analysisData) {
  if (cvIndex >= this.cvHistory.length) {
    throw new Error("CV index out of bounds");
  }

  const analysis = {
    similarity_score: analysisData.similarity_score,
    skills: analysisData.skills || [],
    suggestions: analysisData.suggestions || [],
    analyzedAt: new Date(),
  };

  this.cvHistory[cvIndex].analysis = analysis;
  this.latestAnalysis = analysis;

  return this.save();
};

// Get latest CV with analysis
candidateSchema.methods.getLatestCVWithAnalysis = function () {
  if (this.cvHistory.length === 0) {
    return null;
  }
  return this.cvHistory[this.cvHistory.length - 1];
};

// Add a method to save candidate draft
candidateSchema.methods.saveDraft = async function (draftData) {
  this.draft = draftData;
  return this.save();
};

// Validation functions
const validateCV = (file) => {
  const schema = Joi.object({
    fileName: Joi.string().required(),
    fileSize: Joi.number().max(5 * 1024 * 1024).required(), // 5MB max
    fileType: Joi.string()
      .valid(
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
      .required(),
  });
  return schema.validate(file);
};

const validateAnalysis = (analysis) => {
  const schema = Joi.object({
    similarity_score: Joi.number().min(0).max(1).required(),
    skills: Joi.array().items(Joi.string()).default([]),
    suggestions: Joi.array().items(Joi.string()).default([]),
  });
  return schema.validate(analysis);
};

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = { Candidate, validateCV, validateAnalysis };
