const Expense = require('../models/Expense');
const xlsx = require('xlsx');

// Add Expense
const addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date, recurring = false,
      recurringType = null, pinned = false } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const nextRecurringDate =
          recurring && recurringType === 'monthly'
            ? moment(date).add(1, 'month').toDate()
            : recurring && recurringType === 'weekly'
              ? moment(date).add(1, 'week').toDate()
              : null;

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
      recurring,
      recurringType,
      nextRecurringDate,
      pinned,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Server error while adding expense" });
  }
};

// Get All Expenses
const getAllExpense = async (req, res) => {
  const userId = req.user.id;
  const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

  try {
    let query = { userId };

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);
    res.json(expenses);

    // res.json({
    //     expenses,
    //     totalPages: Math.ceil(total / limit),
    //     currentPage: parseInt(page),
    //     totalExpenses: total
    // });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
};

// Delete Expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this expense" });
    }
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error while deleting expense" });
  }
};

// Update Expense
const updateExpense = async (req, res) => {
  const userId = req.user.id;
  const { icon, category, amount, date } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (expense.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this expense" });
    }

    expense.icon = icon || expense.icon;
    expense.category = category;
    expense.amount = amount;
    expense.date = new Date(date);

    const updatedExpense = await expense.save();
    res.json(updatedExpense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Server error while updating expense" });
  }
};

// Download to Excel
const downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0]
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const excelBuffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx");
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Server error while generating Excel" });
  }
};

// Export all functions
module.exports = {
  addExpense,
  getAllExpense,
  deleteExpense,
  downloadExpenseExcel,
  updateExpense
};
