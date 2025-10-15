const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Shipping Information
    shipping: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address1: { type: String, required: true },
        address2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    // Billing Information
    billing: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        address1: { type: String, required: true },
        address2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true }
    },
    // Payment Information (DO NOT store full card details in production!)
    payment: {
        lastFourDigits: String,
        cardholderName: String
    },
    // Cart Items
    items: [{
        productId: String,
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: Number,
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        default: 'pending',
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    }
});

module.exports = mongoose.model('Order', orderSchema);

