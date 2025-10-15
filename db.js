const mongoose = require('mongoose');
require('dotenv').config();

// Use MONGODB_URL_LOCAL for both local and production
const mongoURL = process.env.MONGODB_URL_LOCAL;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;

db.on('connected', () => {
    console.log('✅ Connected to MongoDB Atlas');
});

db.on('error', (err) => {
    console.error('❌ MongoDB Connection Error:', err);
});

db.on('disconnected', () => {
    console.log('⚠️ MongoDB Disconnected');
});

module.exports = db;
