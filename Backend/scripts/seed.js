// Backend/scripts/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');  

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/user');
const Income = require('../models/Income');
const Expense = require('../models/Expense');

const seedData = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        console.log('Database connected...');

        // Create sample user (password auto-hashed via pre-save hook)
        const user = await User.create({
            fullName: 'Test User',
            email: 'testuser@example.com',
            password: 'TestPass1234',  
            profileImageUrl: null,
            isAdmin: false
        });

        console.log('User seeded...');

        // Create sample incomes
        const incomes = [
            {
                userId: user._id,
                icon: '💼',
                source: 'Salary',
                amount: 6000,
                date: new Date()
            },
            {
                userId: user._id,
                icon: '📈',
                source: 'Freelancing',
                amount: 1200,
                date: new Date()
            }
        ];

        await Income.insertMany(incomes);
        console.log('Incomes seeded...');

        // Create sample expenses
        const expenses = [
            {
                userId: user._id,
                icon: '🍔',
                category: 'Food',
                amount: 150,
                date: new Date(),
                notes: 'Lunch with friends'
            },
            {
                userId: user._id,
                icon: '🚕',
                category: 'Transport',
                amount: 60,
                date: new Date(),
                notes: 'Taxi to airport'
            }
        ];

        await Expense.insertMany(expenses);
        console.log('Expenses seeded...');

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
};

// Execute seeding
seedData();
