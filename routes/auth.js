/*
  routes/auth.js — Register, Login, Logout
  ─────────────────────────────────────────
  POST /register  → create user, sign JWT, set cookie → redirect to /posts
  POST /login     → verify credentials, sign JWT, set cookie → redirect to /posts
  GET  /logout    → clear cookie → redirect to /login

  GET  /register  → show register form
  GET  /login     → show login form
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper: sign JWT and set httpOnly cookie
const signTokenAndRespond = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    res.cookie('token', token, {
        httpOnly: true,   // not accessible via JS — prevents XSS theft
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
        sameSite: 'lax'
    });
};

// ── GET /register ─────────────────────────────────────────────────────────────
router.get('/register', (req, res) => {
    if (req.cookies.token) return res.redirect('/posts');
    res.render('auth/register', { title: 'Create Account' });
});

// ── POST /register ────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    try {
        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            req.flash('error', 'All fields are required.');
            return res.redirect('/register');
        }
        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/register');
        }
        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters.');
            return res.redirect('/register');
        }

        // Check uniqueness
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            req.flash('error', existingUser.email === email
                ? 'Email already in use.'
                : 'Username already taken.');
            return res.redirect('/register');
        }

        // Create user (password hashed in pre-save hook)
        const user = await User.create({ username, email, password });

        signTokenAndRespond(res, user._id);
        req.flash('success', `Welcome to Pixgram, ${user.username}!`);
        res.redirect('/posts');
    } catch (err) {
        // Handle Mongoose validation errors neatly
        const messages = err.errors
            ? Object.values(err.errors).map(e => e.message)
            : [err.message];
        req.flash('error', messages[0]);
        res.redirect('/register');
    }
});

// ── GET /login ────────────────────────────────────────────────────────────────
router.get('/login', (req, res) => {
    if (req.cookies.token) return res.redirect('/posts');
    res.render('auth/login', { title: 'Sign In' });
});

// ── POST /login ───────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            req.flash('error', 'Email and password are required.');
            return res.redirect('/login');
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        signTokenAndRespond(res, user._id);
        req.flash('success', `Welcome back, ${user.username}!`);
        res.redirect('/posts');
    } catch (err) {
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/login');
    }
});

// ── GET /logout ───────────────────────────────────────────────────────────────
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    req.flash('success', 'You have been logged out.');
    res.redirect('/login');
});

module.exports = router;
