const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true 
        },
        icon: {
            type: String,
            trim: true   // clean up string inputs   
        },
        category: {
            type: String,
            required: true,
            trim: true,  // clean up string inputs
 feat/Database
            minlength: 2    
            minlength: main
        },
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount cannot be negative"]
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        notes: {
            type: String,
            trim: true,  // clean up string inputs   
            default: ""
        },

        recurring: {
            type: Boolean,
            default: false,
        },
        recurringType: {
            type: String,
            enum: ['monthly', 'weekly'],
            default: null,
        },
        nextRecurringDate: {
            type: Date,
            default: null,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

//Aggregation function: Total expense for user (all time)
 
ExpenseSchema.statics.totalExpenseByUser = async function(userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalExpense: { $sum: "$amount" } } }
    ]);
};

//Aggregation function: Total expense for user by month
 
ExpenseSchema.statics.totalExpenseByUserPerMonth = async function(userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalExpense: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
};

//Aggregation function: Total expense for user by year
 
ExpenseSchema.statics.totalExpenseByUserPerYear = async function(userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: { year: { $year: "$date" } },
                totalExpense: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1 } }
    ]);
};

module.exports = mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
