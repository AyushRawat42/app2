const express = require('express');
const app = express();
require('dotenv').config();

const User = require('./Model/userser');
const Order = require('./Model/order');
const Partner = require('./Model/partner');
const db = require('./db');

const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Use bcryptjs

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'PartsGenie API is running!' });
});

// ==========================================
// USER SIGNUP/LOGIN ENDPOINTS
// ==========================================

// User Signup
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            phone
        });

        const savedUser = await newUser.save();
        
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// ==========================================
// CHECKOUT/ORDER ENDPOINT
// ==========================================

app.post('/api/checkout', async (req, res) => {
    try {
        const orderData = req.body;

        // Create new order
        const newOrder = new Order({
            shipping: orderData.shipping,
            billing: orderData.billing,
            payment: {
                lastFourDigits: orderData.payment?.cardNumber?.slice(-4),
                cardholderName: orderData.payment?.cardholderName
            },
            items: orderData.items || [],
            totalAmount: orderData.totalAmount || 0
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully!',
            orderId: savedOrder._id,
            orderNumber: savedOrder._id.toString().slice(-8).toUpperCase()
        });
    } catch (err) {
        console.error('Checkout error:', err);
        res.status(500).json({ error: 'Server error during checkout' });
    }
});

// ==========================================
// PARTNER APPLICATION ENDPOINT
// ==========================================

app.post('/api/partner', async (req, res) => {
    try {
        const partnerData = req.body;

        const newPartner = new Partner(partnerData);
        const savedPartner = await newPartner.save();

        res.status(201).json({
            success: true,
            message: 'Partner application submitted successfully!',
            applicationId: savedPartner._id
        });
    } catch (err) {
        console.error('Partner application error:', err);
        res.status(500).json({ error: 'Server error submitting partner application' });
    }
});

// ==========================================
// GET ENDPOINTS (Optional - for testing)
// ==========================================

// Get all orders (admin)
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});

// Get all partner applications (admin)
app.get('/api/partners', async (req, res) => {
    try {
        const partners = await Partner.find().sort({ submittedAt: -1 });
        res.json(partners);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching partners' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
