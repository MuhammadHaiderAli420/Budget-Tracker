const express = require('express');
const router = express.Router();

const incomeController = require('../controllers/incomeController');
console.log("🔍 Income Controller:", incomeController);

const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, incomeController.addIncomeData);

router.get('/get', protect, incomeController.getAllIncome);

// Total income (all time)
router.get('/total/:userId', protect, incomeController.getTotalIncome);

// Total income by month
router.get('/monthly/:userId', protect, incomeController.getMonthlyIncome);

// Total income by year
router.get('/yearly/:userId', protect, incomeController.getYearlyIncome);

router.put('/:id', protect, incomeController.updateIncome);
router.delete('/:id', protect, incomeController.deleteIncome);

module.exports = router;
