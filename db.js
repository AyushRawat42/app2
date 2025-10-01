const mongoose = require('mongoose')
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL);  // Remove the deprecated options

const db = mongoose.connection;

db.on('connected', () => {
    console.log("Connected to MongoDB");
});

db.on('error', (err) => {
    console.error("MongoDB Connection Error:", err);
});

db.on('disconnected', () => {
    console.log("MongoDB Disconnected");
});

module.exports = db;
