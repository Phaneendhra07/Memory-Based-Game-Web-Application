// backend/models/FastestScore.js
const mongoose = require('mongoose');

const fastestScoreSchema = new mongoose.Schema({
  game: { type: String, required: true },
  userId: { type: String },
  time: { type: Number },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FastestScore', fastestScoreSchema);
