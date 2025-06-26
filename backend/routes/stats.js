const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');

// Update Game4 stats
router.post('/game4/update', async (req, res) => {
  try {
    const { email, result } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.game4Stats.gamesPlayed += 1;
    if (result === 'win') user.game4Stats.gamesWon += 1;
    else if(result === 'loss') user.game4Stats.gamesLost += 1;
    else user.game4Stats.gamesDraw += 1;

    const { gamesWon, gamesPlayed } = user.game4Stats;
    user.game4Stats.winRate = Math.round((gamesWon / gamesPlayed) * 100);

    await user.save();
    res.json({ message: 'Stats updated', stats: user.game4Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error updating stats' });
  }
});

// Get Game4 stats
router.get('/game4/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ stats: user.game4Stats });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;