const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();

// POST Route to handle Feedback submission
router.post('/submit-feedback', async (req, res) => {
  const { name, issue, feedback } = req.body;

  // Validate input
  if (!name || !issue || !feedback) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Create a new feedback entry
    const newFeedback = new Feedback({
      name,
      issue,
      feedback
    });

    // Save to the database
    await newFeedback.save();

    // Return success response
    return res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
