const express = require('express');
const app = express();

require('dotenv').config();

const User = require('./Model/user')
const Bill = require('./Model/checkout')
const db = require('./db');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const PORT = process.env.PORT || 3000

const path = require('path');
const cors = require('cors');

app.use(cors());

// Static file serving from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route serves index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Contact form submission
app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        console.log('Contact form data received:', data);
        
        if (!data.name || !data.email) {
            return res.status(400).json({ 
                error: 'Name and email are required' 
            });
        }

        const newUser = new User({
            username: data.name,
            email: data.email,
            phone: data.phone || 0,
            part: data.part || 'Engine',
            year: data.year,
            model: data.model,
            message: data.message
        });

        const response = await newUser.save();
        console.log("Contact inquiry saved");
        
        res.status(200).json({
            success: true,
            message: "Contact inquiry submitted successfully",
            response: response
        });
        
    } catch(err) {
        console.error('Contact form error:', err);
        res.status(500).json({ 
            error: 'Failed to submit contact form',
            details: err.message 
        });
    }
});

// Checkout form submission
app.post('/submitbill', async (req, res) => {
    try {
        const data = req.body;
        console.log('Checkout data received:', data);
        
        if (!data.firstName || !data.lastName || !data.email) {
            return res.status(400).json({ 
                error: 'First name, last name, and email are required' 
            });
        }

        const newBill = new Bill(data);
        const response = await newBill.save();
        console.log("Order submitted successfully");
        
        res.status(200).json({
            success: true,
            message: "Order submitted successfully",
            orderId: response._id,
            response: response
        });
        
    } catch(err) {
        console.error('Checkout error:', err);
        res.status(500).json({ 
            error: 'Failed to process order',
            details: err.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - File not found:', req.url);
    res.status(404).json({ 
        error: 'Page not found',
        requestedPath: req.url
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log('Files should be accessible at:');
    console.log(`- http://localhost:${PORT}/cart.html`);
    console.log(`- http://localhost:${PORT}/shop.html`);
    console.log(`- http://localhost:${PORT}/about.html`);
});
