const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    annualRevenue: String,
    location: String,
    website: String,
    message: String,
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Partner', partnerSchema);
