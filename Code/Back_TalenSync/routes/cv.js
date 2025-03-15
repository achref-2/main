const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Candidate = require('../models/candidate');

router.get('/cv-history', auth, async (req, res) => {
    try {
        if (!req.user) {
            console.log("Unauthorized request: No user found");
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const candidate = await Candidate.findOne({ userId: req.user._id });
        if (!candidate) {
            console.log(`Candidate not found for user ID: ${req.user._id}`);
            return res.status(404).json({ error: 'Candidate not found' });
        }

        const history = candidate.cvHistory.map(cv => ({
            fileName: cv.fileName,
            fileSize: cv.fileSize,
            fileType: cv.fileType,
            uploadDate: cv.uploadDate,
            hasAnalysis: !!cv.analysis
        }));

        console.log(`Fetched ${history.length} CV records for user ID: ${req.user._id}`);
        res.status(200).json(history);
    } catch (error) {
        console.error('Error fetching CV history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
