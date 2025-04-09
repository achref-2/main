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
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true
  },
  companyName: {
    type: String,
    required: false,
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
  applicationCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  experienceLevel: {
    type: String,
    enum: ['Entry-level', 'Mid-level', 'Senior', 'Executive'],
    default: 'Mid-level'
  },
  educationRequirements: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Engineering",
      "Design",
      "Marketing",
      "Sales",
      "Product",
      "Support",
      "Finance",
      "HR",
      "IT"
    ],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for better performance
jobSchema.index({ title: 'text', description: 'text', skills: 'text', location: 'text' });
jobSchema.index({ status: 1 });
jobSchema.index({ recruiter: 1 });
jobSchema.index({ deadline: 1 });
jobSchema.index({ featured: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ jobType: 1 });

// Add a virtual field to check if job is expired
jobSchema.virtual('isExpired').get(function() {
  return this.deadline < new Date();
});

// Pre-save middleware to update timestamps
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to update application count when a candidate applies
jobSchema.methods.addApplicant = function(candidateId) {
  if (!this.applicants.includes(candidateId)) {
    this.applicants.push(candidateId);
    this.applicationCount = this.applicants.length;
  }
  return this.save();
};

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
    status: Joi.string().valid('active', 'closed', 'draft'),
    experienceLevel: Joi.string().valid('Entry-level', 'Mid-level', 'Senior', 'Executive'),
    educationRequirements: Joi.string(),
    industry: Joi.string(),
    featured: Joi.boolean(),
    companyName: Joi.string().required(),
    category: Joi.string()
      .valid(
        "Engineering",
        "Design",
        "Marketing",
        "Sales",
        "Product",
        "Support",
        "Finance",
        "HR",
        "IT"
      )
      .required()
  });

  return schema.validate(job);
};

// Check if the model already exists before defining it
const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

module.exports = { Job, validateJob };