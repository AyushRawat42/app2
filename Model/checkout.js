const mongoose = require("mongoose");  // Fixed: mongoose spelling

const BillSchema = new mongoose.Schema({  // Fixed: mongoose spelling
    // Shipping Information
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
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
    
    // Billing Information (if different from shipping)
    billingSame: {
        type: Boolean,
        default: true
    },
    billingFirstName: {
        type: String,
    },
    billingLastName: {
        type: String,
    },
    billingAddressLine1: {
        type: String,
    },
    billingAddressLine2: {
        type: String,
    },
    billingCity: {
        type: String,
    },
    billingState: {
        type: String,
    },
    billingZipCode: {
        type: String,
    },
    
    // Payment Information (Note: In production, never store card details in database)
    cardNumber: {
        type: String,
        required: true
    },
    nameOnCard: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    
    // Order Information
    cartItems: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

const Bill = mongoose.model('Bill', BillSchema);  // Fixed: mongoose spelling
module.exports = Bill;
