const mongoose = require('mongoose');
const Joi = require('joi');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  requirements: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
  },
  skills: [{
    type: String,
    trim: true
  }],
  deadline: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 days from now
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate'
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for better performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ deadline: 1 });

// Validation function for creating/updating jobs
const validateJob = (job) => {
  const schema = Joi.object({
    title: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    requirements: Joi.string().required(),
    location: Joi.string().required(),
    salary: Joi.string().required(),
    jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship', 'Remote').required(),
    skills: Joi.array().items(Joi.string()),
    deadline: Joi.date().min('now'),
    status: Joi.string().valid('active', 'closed', 'draft')
  });
  
  return schema.validate(job);
};

const Job = mongoose.model('Job', jobSchema);

module.exports = { Job, validateJob };