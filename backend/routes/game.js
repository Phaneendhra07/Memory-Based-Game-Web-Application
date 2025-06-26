// backend/routes/game.js
const express = require('express');
const router = express.Router();
const GameImage = require('../models/GameImage');
const Score = require('../models/Score');
const FastestScore = require('../models/FastestScore');

// ✅ GET images for a specific game (Game1)
router.get('/images/:game', async (req, res) => {
  try {
    const images = await GameImage.find({ game: req.params.game });
    res.status(200).json(images.map(img => img.url));
  } catch (err) {
    console.error('❌ Error loading images:', err);
    res.status(500).json({ message: 'Image fetch failed', error: err.message });
  }
});

// ✅ POST score
router.post('/score', async (req, res) => {
  const { userId, game, time } = req.body;
  try {
    await Score.create({ userId, game, time });

    const existing = await FastestScore.findOne({ game });
    if (!existing || time < existing.time) {
      await FastestScore.findOneAndUpdate(
        { game },
        { userId, time, updatedAt: new Date() },
        { upsert: true }
      );
    }

    res.status(200).json({ message: 'Score recorded' });
  } catch (err) {
    console.error("❌ Failed to record score:", err);
    res.status(500).json({ message: 'Failed to record score', error: err.message });
  }
});

// ✅ GET fastest score
router.get('/fastest/:game', async (req, res) => {
  try {
    const fastest = await FastestScore.findOne({ game: req.params.game });
    res.status(200).json({ fastest });
  } catch (err) {
    console.error("❌ Failed to fetch fastest score:", err);
    res.status(500).json({ message: 'Failed to fetch fastest score', error: err.message });
  }
});

module.exports = router;
