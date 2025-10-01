const mongoose = require("mongoose");  // Fixed: mongoose spelling
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({  // Fixed: mongoose spelling
    username: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true  // Made required for contact form
    },
    part: {
        type: String,
        enum: ['Engine', 'Transmission', 'Turbo', 'Other'],
        default: 'Engine',
        required: true
    },
    year: {
        type: Number,
    },
    model: {
        type: String,
    },
    message: {  // Added message field for contact form
        type: String
    }
}, {
    timestamps: true  // Add createdAt and updatedAt automatically
});

// Note: Removed password hashing since this is for contact inquiries, not user accounts
// If you need user authentication later, we'll create a separate schema

const User = mongoose.model('User', userSchema);  // Fixed: mongoose spelling
module.exports = User;
