require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/User');
const Transaction = require('./Models/Transaction');
const Budget = require('./Models/Budget');
const bcrypt = require('bcrypt');

const testDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for testing');

    // Create test user
    const password = await bcrypt.hash('test123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'testuser2@example.com',
      password
    });
    console.log('User created:', user.email);

    // Create a budget
    const budget = await Budget.create({
      userID: user._id,
      category: 'Food',
      budgetLimit: 200
    });
    console.log('Budget created for:', budget.category);

    // Create a transaction
    const transaction = await Transaction.create({
      userID: user._id,
      type: 'Expense',
      amount: 50,
      category: 'Food',
      date: new Date()
    });
    console.log('Transaction created:', transaction.amount);

    process.exit();
  } catch (error) {
    console.error('Error during DB test:', error.message);
    process.exit(1);
  }
};

testDatabase();
