// Backend/scripts/testModels.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/user');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

const testModels = async () => {
    try {
        // Connect to MongoDB 
        await connectDB();
        console.log('Database connected...');

        // Test User model
        const user = new User({
            fullName: 'John Doe',
            email: 'johndoe@example.com',
            password: 'SecurePass1234',
            profileImageUrl: null,
            isAdmin: false
        });

        await user.validate();  // only validate, don't save
        console.log('User model validated successfully.');

        // Test Income model
        const income = new Income({
            userId: new mongoose.Types.ObjectId(), // dummy ObjectId for test
            icon: '💼',
            source: 'Freelancing',
            amount: 5000,
            date: new Date()
        });

        await income.validate();
        console.log('Income model validated successfully.');

        // Test Expense model
        const expense = new Expense({
            userId: new mongoose.Types.ObjectId(),  // dummy ObjectId
            icon: '🍔',
            category: 'Food',
            amount: 200,
            date: new Date(),
            notes: 'Dinner at restaurant'
        });

        await expense.validate();
        console.log('Expense model validated successfully.');

        console.log('All models validated successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Model validation failed:', err.message);
        process.exit(1);
    }
};

// Run model test
testModels();
