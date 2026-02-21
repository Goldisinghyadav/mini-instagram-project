/*
  models/User.js — User Schema
  ──────────────────────────────
  Fields:
    username     – unique display name
    email        – unique login identifier
    password     – bcrypt-hashed (never stored plain)
    postsCount   – tracks uploads (enforces 10-post limit)
    bio          – optional profile bio
    avatar       – optional avatar URL / path
    createdAt    – auto timestamp

  Pre-save hook automatically hashes password when modified.
  Instance method comparePassword() used during login.
*/

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
            minlength: [3, 'Username must be at least 3 characters'],
            maxlength: [20, 'Username cannot exceed 20 characters'],
            match: [/^[a-zA-Z0-9_.]+$/, 'Username can only contain letters, numbers, _ and .']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters']
        },
        postsCount: {
            type: Number,
            default: 0
        },
        bio: {
            type: String,
            default: '',
            maxlength: [150, 'Bio cannot exceed 150 characters']
        }
    },
    { timestamps: true }
);

// Hash password before saving (only when modified)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare plain password with stored hash during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
