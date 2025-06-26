const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// POST to update stats
router.post('/update', async (req, res) => {
  try {
    const { email, time, flips } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.game1Stats.gamesPlayed += 1;
    if (!user.game1Stats.bestTime || time < user.game1Stats.bestTime) {
      user.game1Stats.bestTime = time;
    }
    if (!user.game1Stats.bestFlips || flips < user.game1Stats.bestFlips) {
      user.game1Stats.bestFlips = flips;
    }

    await user.save();
    res.json({ message: 'Stats updated', stats: user.game1Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// GET stats
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ stats: user.game1Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
