const mongoose = require('mongoose');
const Joi = require('joi');

const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
  coverLetter: { type: String, default: "" },
  cvPath: { type: String, required: true },
  score: { type: Number, required: true }, // Ensure this field is included
  date: { type: Date, required: true, default: Date.now }, // Ensure this field is included
  file: { type: String, required: true }, // Ensure this field is included
  level: {
    type: String,
    required: true
    // Remove enum temporarily to see if this is the issue
  },
  status: {
    type: String,
    default: "Under Review"
    // Remove enum temporarily to see if this is the issue
  },
  title: { type: String, required: true }, // Ensure this field is included
  
  appliedAt: { type: Date, default: Date.now },
});

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
    level: Joi.string().valid('Entry-level', 'Mid-level', 'Senior', 'Executive').required(),
    status: Joi.string().valid('Under Review', 'Pending', 'Accepted', 'Refused'),  });

  return schema.validate(application);
};

// Check if the model already exists before defining it
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

module.exports = { Application, validateApplication };