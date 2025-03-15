const mongoose = require('mongoose');
const Joi = require('joi');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  resumeUrl: {
    type: String,
    required: true
  },
  coverLetter: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
    default: 'pending'
  },
  feedback: {
    type: String,
    trim: true
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create compound index to ensure a candidate can only apply once to a job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// Additional indexes for queries
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Validation function
const validateApplication = (application) => {
  const schema = Joi.object({
    jobId: Joi.string().required(),
    resumeUrl: Joi.string().required(),
    coverLetter: Joi.string(),
    status: Joi.string().valid('pending', 'reviewed', 'shortlisted', 'rejected', 'hired')
  });
  
  return schema.validate(application);
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = { Application, validateApplication };