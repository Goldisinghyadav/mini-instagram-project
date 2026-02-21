/*
  app.js — Express Entry Point
  ─────────────────────────────
  • Loads env vars
  • Connects to MongoDB
  • Sets up middleware (EJS, static files, cookies, sessions, flash, method-override)
  • Mounts routes
  • Starts server
*/

require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');

// ── Connect MongoDB ───────────────────────────────────────────────────────────
connectDB();

const app = express();

// ── View Engine ───────────────────────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));   // parse form data
app.use(express.json());                            // parse JSON bodies
app.use(cookieParser());                            // read cookies (JWT lives here)

// Session — needed only for flash messages
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

// Make flash messages & current user available in every EJS template
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = null; // overridden by auth middleware when needed
    next();
});

// Support PUT and DELETE via HTML forms using ?_method=PUT
app.use(methodOverride('_method'));

// Serve static files (CSS, uploads)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

app.use('/', authRoutes);
app.use('/posts', postRoutes);

// Root → redirect to feed
app.get('/', (req, res) => res.redirect('/posts'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: '404 – Page not found' });
});

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 Pixgram running at http://localhost:${PORT}\n`);
});
