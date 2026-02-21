/*
  routes/posts.js — Post CRUD + Pagination + Security
  ─────────────────────────────────────────────────────
  GET  /posts           → paginated feed (4 per page) — public
  GET  /posts/create    → upload form — auth required
  POST /posts/create    → multer upload + save — auth required, 10-post limit
  GET  /posts/:id/edit  → edit form — auth + own post only
  PUT  /posts/:id       → update caption — auth + own post only
  DELETE /posts/:id     → delete post — auth + own post only
  GET  /profile         → logged-in user's profile
  GET  /profile/:username → any user's profile
*/

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
const { requireAuth, injectUser } = require('../middleware/auth');

const router = express.Router();

// ── Multer Upload Config ──────────────────────────────────────────────────────
// Files are saved to /uploads/ with a unique timestamp-based filename.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPG, PNG, GIF, WEBP) are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

const POSTS_PER_PAGE = 4;   // Phase 3: 4 posts per page
const MAX_POSTS = 10;  // Phase 4: 10-post limit per user

// ── GET /posts — Paginated Feed ───────────────────────────────────────────────
router.get('/', injectUser, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * POSTS_PER_PAGE;
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

        const posts = await Post.find()
            .sort({ createdAt: -1 })        // newest first
            .skip(skip)
            .limit(POSTS_PER_PAGE)
            .populate('user', 'username');  // join user info

        res.render('posts/index', {
            title: 'Feed',
            posts,
            currentPage: page,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load posts.');
        res.redirect('/');
    }
});

// ── GET /posts/create — Upload Form ──────────────────────────────────────────
router.get('/create', requireAuth, (req, res) => {
    res.render('posts/create', { title: 'New Post' });
});

// ── POST /posts/create — Upload & Save ───────────────────────────────────────
router.post('/create', requireAuth, (req, res, next) => {
    // Run multer first so we can handle its errors cleanly
    upload.single('image')(req, res, async (err) => {
        if (err) {
            req.flash('error', err.message || 'File upload failed.');
            return res.redirect('/posts/create');
        }
        try {
            // Phase 4: 10-post limit enforcement
            const user = await User.findById(req.user._id);
            if (user.postsCount >= MAX_POSTS) {
                // Delete the uploaded file since we reject the post
                if (req.file) fs.unlinkSync(req.file.path);
                req.flash('error', `You've reached the maximum of ${MAX_POSTS} posts.`);
                return res.redirect('/posts/create');
            }

            if (!req.file) {
                req.flash('error', 'Please select an image to upload.');
                return res.redirect('/posts/create');
            }

            const caption = req.body.caption?.trim();
            if (!caption) {
                fs.unlinkSync(req.file.path);
                req.flash('error', 'Caption is required.');
                return res.redirect('/posts/create');
            }

            // Save post to DB
            const imagePath = `/uploads/${req.file.filename}`;
            await Post.create({
                caption,
                imagePath,
                user: req.user._id
            });

            // Increment user's post count
            await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: 1 } });

            req.flash('success', 'Your post has been shared!');
            res.redirect('/posts');
        } catch (dbErr) {
            console.error(dbErr);
            if (req.file) fs.unlinkSync(req.file.path);
            req.flash('error', 'Could not save post. Please try again.');
            res.redirect('/posts/create');
        }
    });
});

// ── GET /posts/:id/edit — Edit Form ──────────────────────────────────────────
router.get('/:id/edit', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error', 'Post not found.');
            return res.redirect('/posts');
        }
        // Phase 4: own-post-only guard
        if (post.user.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to edit this post.');
            return res.redirect('/posts');
        }
        res.render('posts/edit', { title: 'Edit Post', post });
    } catch (err) {
        req.flash('error', 'Post not found.');
        res.redirect('/posts');
    }
});

// ── PUT /posts/:id — Update Caption ──────────────────────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error', 'Post not found.');
            return res.redirect('/posts');
        }
        if (post.user.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to edit this post.');
            return res.redirect('/posts');
        }
        const caption = req.body.caption?.trim();
        if (!caption) {
            req.flash('error', 'Caption cannot be empty.');
            return res.redirect(`/posts/${req.params.id}/edit`);
        }
        await Post.findByIdAndUpdate(req.params.id, { caption });
        req.flash('success', 'Post updated successfully!');
        res.redirect('/posts');
    } catch (err) {
        req.flash('error', 'Could not update post.');
        res.redirect('/posts');
    }
});

// ── DELETE /posts/:id — Delete Post ──────────────────────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error', 'Post not found.');
            return res.redirect('/posts');
        }
        if (post.user.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to delete this post.');
            return res.redirect('/posts');
        }

        // Delete image file from disk
        const filePath = path.join(__dirname, '..', post.imagePath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await Post.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(req.user._id, { $inc: { postsCount: -1 } });

        req.flash('success', 'Post deleted.');
        res.redirect('/posts');
    } catch (err) {
        req.flash('error', 'Could not delete post.');
        res.redirect('/posts');
    }
});

// ── GET /profile — Own Profile ────────────────────────────────────────────────
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.render('profile', {
            title: `${req.user.username}'s Profile`,
            profileUser: req.user,
            posts
        });
    } catch (err) {
        req.flash('error', 'Failed to load profile.');
        res.redirect('/posts');
    }
});

// ── GET /profile/:username — Any User's Profile ───────────────────────────────
router.get('/profile/:username', injectUser, async (req, res) => {
    try {
        const profileUser = await User.findOne({ username: req.params.username });
        if (!profileUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/posts');
        }
        const posts = await Post.find({ user: profileUser._id }).sort({ createdAt: -1 });
        res.render('profile', {
            title: `${profileUser.username}'s Profile`,
            profileUser,
            posts
        });
    } catch (err) {
        req.flash('error', 'User not found.');
        res.redirect('/posts');
    }
});

module.exports = router;
