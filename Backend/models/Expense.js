const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        icon: {
            type: String,
            trim: true   // clean up string inputs   
        },
        category: {
            type: String,
            required: true,
            trim: true  // clean up string inputs
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
            default: Date.now
        },
        notes: {
            type: String,
            trim: true,  // clean up string inputs   
            default: ""
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Expense", ExpenseSchema);