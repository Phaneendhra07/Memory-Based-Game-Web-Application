const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// Update Game3 stats
router.post('/update', async (req, res) => {
  try {
    const { email, time, flips } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.game3Stats.gamesPlayed += 1;

    if (
      user.game3Stats.bestTime === null ||
      time < user.game3Stats.bestTime
    ) {
      user.game3Stats.bestTime = time;
    }

    if (
      user.game3Stats.bestFlips === null ||
      flips < user.game3Stats.bestFlips
    ) {
      user.game3Stats.bestFlips = flips;
    }

    await user.save();
    res.json({ message: 'Stats updated', stats: user.game3Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// Get Game3 stats
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ stats: user.game3Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
