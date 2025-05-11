const express = require('express');
const router = express.Router();
const Expense = require('../models/expense');
const expenseController = require('../controllers/expenseController');
const multer = require('multer');

const upload = multer({ dest: './uploads/' });

// Route for adding expense manually
router.post('/add', (req, res) => {
  const { name, amount, date, category } = req.body;

  const expense = new Expense({
    name,
    amount,
    date,
    category,
  });

  expense.save()
    .then(() => {
      res.status(200).json({ message: 'Expense added successfully' });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error adding expense', error: err });
    });
});

// Route for fetching all expenses
router.get('/', (req, res) => {
  Expense.find()
    .then((expenses) => {
      res.status(200).json(expenses);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error fetching expenses', error: err });
    });
});

// ✅ New route using controller to extract data from uploaded PDF
router.post('/upload', upload.single('file'), expenseController.uploadExpenseDocument);

module.exports = router;
