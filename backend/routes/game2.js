// routes/game2.js
const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// Update Game 2 stats
router.post('/update', async (req, res) => {
  try {
    const { email, time } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.game2Stats.gamesPlayed += 1;

    if (
      user.game2Stats.bestTime === null ||
      time < user.game2Stats.bestTime
    ) {
      user.game2Stats.bestTime = time;
    }

    await user.save();
    res.json({ message: 'Stats updated', stats: user.game2Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// Get Game 2 stats
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ stats: user.game2Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
