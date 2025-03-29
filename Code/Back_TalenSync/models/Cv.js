const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CVSchema = new Schema({
  // Reference to the user who owns this CV
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Original filename provided by the user
  originalName: {
    type: String,
    required: true
  },
  
  // System filename (how it's stored on the server)
  filename: {
    type: String,
    required: true,
    unique: true
  },
  
  // File path where the CV is stored
  path: {
    type: String,
    required: true
  },
  
  // File size in bytes
  size: {
    type: Number,
    required: true
  },
  
  // MIME type of the file
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  
  // CV upload date
  uploadDate: {
    type: Date,
    default: Date.now
  },
  
  // CV status (for tracking review process)
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Additional metadata/extracted info
  metadata: {
    // Fields extracted from CV parsing
    skills: [String],
    education: [String],
    experience: [String],
    languages: [String],
    // Any other extracted fields
    additionalInfo: Schema.Types.Mixed
  },
  
  // Review notes (if applicable)
  notes: {
    type: String
  },
  
  // Flag for if this is the current active CV
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Method to mark this CV as active and deactivate others
CVSchema.methods.setAsActive = async function() {
  // Find all other CVs for this user and set them as inactive
  await this.model('CV').updateMany(
    { user: this.user, _id: { $ne: this._id } },
    { isActive: false }
  );
  
  // Set this CV as active
  this.isActive = true;
  return this.save();
};

// Pre-save hook to ensure only one CV is active
CVSchema.pre('save', async function(next) {
  // If this is a new CV or being set to active
  if (this.isNew || this.isModified('isActive')) {
    if (this.isActive) {
      // Deactivate all other CVs for this user
      await this.model('CV').updateMany(
        { user: this.user, _id: { $ne: this._id } },
        { isActive: false }
      );
    }
  }
  next();
});

// Index for faster queries by user
CVSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model('CV', CVSchema);