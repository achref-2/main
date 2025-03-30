const express = require('express');
//const { Application } = require('../models/Application')

const router = express.Router();

// Static data for initial applications
const initialApplications = [
  {
    title: 'Backend Developer',
    level: 'JUNIOR',
    file: 'cv.pdf',
    date: '2025-02-06',
    status: 'Incomplete',
    score: 100,
  },
  {
    title: 'Frontend Developer',
    level: 'JUNIOR',
    file: 'achref.cv_(2).pdf',
    date: '2025-02-01',
    status: 'Incomplete',
    score: 80,
  },
];

// Endpoint to fetch applications
router.get('/', async (req, res) => {
  try {
    // Uncomment the following lines if you want to fetch from the database
    // const applications = await Application.find();
    // res.json(applications);

    // For now, return static data
    res.json(initialApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;