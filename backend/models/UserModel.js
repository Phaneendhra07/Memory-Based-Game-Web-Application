// models/UserModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // username: { type: String , required:true, default:player},
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  game4Stats: {
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    gamesLost: { type: Number, default: 0 },
    gamesDraw: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
  },
  game3Stats: {
    gamesPlayed: { type: Number, default: 0 },
    bestTime: { type: Number, default: null },
    bestFlips: { type: Number, default: null },
  },
  game2Stats: {
    gamesPlayed: { type: Number, default: 0 },
    bestTime: { type: Number, default: null },
  },
  game1Stats: {
  gamesPlayed: { type: Number, default: 0 },
  bestTime: { type: Number, default: null },
  bestFlips: { type: Number, default: null },
},
}, { timestamps: true });

module.exports = mongoose.model('UserModel', userSchema, 'credentials');
