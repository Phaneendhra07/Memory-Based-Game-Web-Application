const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const statsRoutes = require('./routes/stats');
const game3Routes = require('./routes/game3');
const authRoutes = require('./routes/auth');
const game2Routes = require('./routes/game2');
const game1Routes = require('./routes/game1');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/stats', statsRoutes);
app.use('/game3', game3Routes);
app.use('/game2', game2Routes);
app.use('/game1', game1Routes);

app.get('/ping', (req, res) => {
    res.send({ message: 'index/ping:invoked' })
})

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));