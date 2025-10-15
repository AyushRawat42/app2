const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    partType: {
        type: String,
        required: true,
        enum: ['Engine', 'Transmission', 'Turbo']
    },
    makeYear: {
        type: String,
        required: true
    },
    makeModel: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'quoted', 'completed']
    }
});

module.exports = mongoose.model('Quote', quoteSchema);
