const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/UserModel');

// Health check route
router.get('/ping', (req, res) => {
    res.send({ message: '/auth/ping: invoked' });
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ ok: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// Signin route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist. Please sign up.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        res.status(200).json({ ok: true, message: 'Login successful' });
    } catch (error) {
        console.error('Signin Error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});

module.exports = router;
   