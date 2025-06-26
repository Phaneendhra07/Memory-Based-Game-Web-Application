// backend/models/GameImage.js
const mongoose = require('mongoose');

const gameImageSchema = new mongoose.Schema({
  game: { type: String, required: true },
  url: { type: String, required: true }
});

module.exports = mongoose.model('GameImage', gameImageSchema);
