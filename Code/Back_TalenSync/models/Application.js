const mongoose = require('mongoose');
const Joi = require('joi');
const applicationSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true },
    coverLetter: { type: String, default: "" },
    cvPath: { type: String, required: true },
    score: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    file: { type: String, required: true },
    title: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    level: { type: String, enum: ['JUNIOR', 'MID', 'SENIOR'], required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }, // Add 'status' field
  },
  { collection: "applications", strict: true } // Ensure strict mode is enabled
);
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
  });

  return schema.validate(application);
};

// Check if the model already exists before defining it
const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);

module.exports = { Application, validateApplication };