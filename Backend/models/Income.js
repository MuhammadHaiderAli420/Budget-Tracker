const mongoose = require('mongoose');

const IncomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  },
  recurring: {
  type: Boolean,
  default: false
},
recurringType: {
  type: String,
  enum: ['monthly', 'weekly'],
  default: null
},
nextRecurringDate: {
  type: Date,
  default: null
},
pinned: {
  type: Boolean,
  default: false,
}
}, { timestamps: true });

// Prevent OverwriteModelError 
module.exports = mongoose.models.Income || mongoose.model('Income', IncomeSchema);
