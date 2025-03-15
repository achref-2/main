const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  permissions: [String], // Example: ['manage_users', 'approve_jobs']
});

module.exports = mongoose.model("Admin", adminSchema);
