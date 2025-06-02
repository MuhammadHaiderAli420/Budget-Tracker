const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  icon: {
    type: String,
    trim: true  // clean up string inputs
  },
  source: {
    type: String,
    required: true,
    trim: true,  // clean up string inputs
    minlength: 2
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"]
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  }
}, { timestamps: true });

//Aggregation function: Total income for user (all time)

IncomeSchema.statics.totalIncomeByUser = async function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalIncome: { $sum: "$amount" } } }
  ]);
};

//Aggregation function: Total income for user by month
 
IncomeSchema.statics.totalIncomeByUserPerMonth = async function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        totalIncome: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);
};


//Aggregation function: Total income for user by year
 
IncomeSchema.statics.totalIncomeByUserPerYear = async function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: { year: { $year: "$date" } },
        totalIncome: { $sum: "$amount" }
      }
    },
    { $sort: { "_id.year": 1 } }
  ]);
};

// Prevent OverwriteModelError 
module.exports = mongoose.models.Income || mongoose.model('Income', IncomeSchema);
