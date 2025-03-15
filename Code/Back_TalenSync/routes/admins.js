// Routes file
const express = require("express");
const admin = require("../models/admin");
const User = require("../models/user");
const Recruiter = require("../models/Recruiter");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");
const checkPermission = require("../middleware/checkPermission");  // Importing the middleware

const router = express.Router();

// Middleware to check admin permissions


// Route for pending recruiters
router.get("/pending-recruiters", auth, checkRole(["admin"]), checkPermission("manage_users"), async (req, res) => {
    try {
        const pendingUsers = await User.find({ role: "recruiter", status: "pending" }).select("-password");

        if (!pendingUsers.length) {
            return res.status(404).send({ message: "No pending recruiters found" });
        }

        res.status(200).send(pendingUsers);
    } catch (error) {
        console.error("Error fetching pending recruiters:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// Route for approving a recruiter
router.post("/approve-recruiter/:id", async (req, res) => {
    try {
        const recruiter = await User.findById(req.params.id);
        if (!recruiter) {
            return res.status(404).send({ message: "Recruiter not found" });
        }
        recruiter.status = "approved"; // Update status to approved
        await recruiter.save();
        res.status(200).send({ message: "Recruiter approved successfully" });
    } catch (error) {
        console.error("Error approving recruiter:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


module.exports = router;
