/*
  middleware/auth.js — JWT Verification
  ──────────────────────────────────────
  Reads the JWT from `req.cookies.token`.
  If valid → attaches user data to req.user and res.locals.currentUser
             then calls next().
  If invalid / missing → redirects to /login with a flash error.

  Usage:  router.get('/create', requireAuth, (req, res) => { ... })
*/

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash('error', 'You must be logged in to do that.');
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            res.clearCookie('token');
            req.flash('error', 'Session expired. Please log in again.');
            return res.redirect('/login');
        }

        req.user = user;
        res.locals.currentUser = user;  // available in all EJS templates
        next();
    } catch (err) {
        res.clearCookie('token');
        req.flash('error', 'Invalid session. Please log in again.');
        res.redirect('/login');
    }
};

/*
  injectUser — Soft version: attaches user if token is valid,
  but does NOT redirect if no token (used on public pages like feed).
*/
const injectUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user) {
            req.user = user;
            res.locals.currentUser = user;
        }
    } catch (_) {
        res.clearCookie('token');
    }
    next();
};

module.exports = { requireAuth, injectUser };
