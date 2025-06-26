const mongoose = require('mongoose');
const GameImage = require('../models/GameImage');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const images = [
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/png-red-apple-isolated-white-background_185193-163303.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/slice-watermelon-white-background_93675-128140.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/grapes-fruit-isolated-white-background_74190-4053.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/delicious-mango-still-life_23-2151542130.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/bananas_1339-1180.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/pineapple-fruit_74190-4912.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/pngjuicy-pomegranate-isolated-white-background_185193-165541.jpg' },
  { game: 'Game1', url: 'https://img.freepik.com/free-photo/view-delicious-healthy-cantaloupe-melon_23-2151659017.jpg' }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    await GameImage.deleteMany({ game: 'Game1' });
    await GameImage.insertMany(images);
    console.log('✅ Game1 images inserted!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
