/*
  models/Post.js — Post Schema
  ─────────────────────────────
  Fields:
    caption    – text describing the photo
    imagePath  – relative path to uploaded file (e.g. /uploads/1234.jpg)
    user       – ref to User who created this post
    likes      – simple count (not a full like system for this scope)
    createdAt  – auto timestamp
*/

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            required: [true, 'Caption is required'],
            trim: true,
            maxlength: [500, 'Caption cannot exceed 500 characters']
        },
        imagePath: {
            type: String,
            required: [true, 'Image is required']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
