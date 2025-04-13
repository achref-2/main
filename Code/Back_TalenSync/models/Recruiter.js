const mongoose = require('mongoose');
const Joi = require('joi');


const recruiterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, default: '' },
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  approved: { type: Boolean, default: false },
}, { timestamps: true });

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = {  Recruiter };