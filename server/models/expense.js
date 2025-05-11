const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  filePath: { // Optional: Only used if an expense is uploaded through a file
    type: String,
    default: null,
  },
  fileType: { // Optional: Track the type of file uploaded
    type: String,
    default: null,
  }
});

const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = Expense;
