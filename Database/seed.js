require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Import models
const User = require('./Models/User');
const Transaction = require('./Models/Transaction');
const Budget = require('./Models/Budget');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding');
  } catch (error) {
    console.error('Connection failed:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Create user
    const hashedPassword = await bcrypt.hash('SecurePass123!', 12);
    const user = await User.create({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword
    });

    // Create budgets
    const budgets = await Budget.insertMany([
      { userID: user._id, category: 'Food', budgetLimit: 250 },
      { userID: user._id, category: 'Transport', budgetLimit: 100 },
      { userID: user._id, category: 'Entertainment', budgetLimit: 150 }
    ]);

    // Create transactions
    const transactions = await Transaction.insertMany([
      {
        userID: user._id,
        type: 'Expense',
        amount: 45,
        category: 'Food',
        date: new Date()
      },
      {
        userID: user._id,
        type: 'Income',
        amount: 1000,
        category: 'Salary',
        date: new Date()
      },
      {
        userID: user._id,
        type: 'Expense',
        amount: 20,
        category: 'Transport',
        date: new Date()
      }
    ]);

    console.log('Seed data inserted successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
