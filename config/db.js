/*
  config/db.js — MongoDB Connection
  ──────────────────────────────────
  Uses Mongoose to connect to MONGO_URI from .env
  Exits process on failure so app never runs without a DB.
*/

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB connection failed: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
