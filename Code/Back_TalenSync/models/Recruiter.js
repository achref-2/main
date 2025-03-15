const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  jobPostings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],  
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

module.exports = mongoose.model('Recruiter', recruiterSchema);