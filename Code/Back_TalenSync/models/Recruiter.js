const mongoose = require('mongoose');
const Joi = require('joi');

const applicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      enum: ['JUNIOR', 'MID', 'SENIOR'],
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Incomplete', 'Complete', 'Rejected'],
      default: 'Incomplete',
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

// Validation function
const validateApplication = (application) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    level: Joi.string().valid('JUNIOR', 'MID', 'SENIOR').required(),
    file: Joi.string().required(),
    date: Joi.date().required(),
    status: Joi.string().valid('Incomplete', 'Complete', 'Rejected'),
    score: Joi.number().min(0).max(100).required(),
  });

  return schema.validate(application);
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = { Application, validateApplication };