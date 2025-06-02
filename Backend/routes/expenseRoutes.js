const express = require("express");
const {
    addExpense,
    getAllExpense,
    deleteExpense,
    downloadExpenseExcel,
    updateExpense,
    getTotalExpense,
    getMonthlyExpense,
    getYearlyExpense
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addExpense);
router.get("/get", protect, getAllExpense);
router.get("/downloadExcel", protect, downloadExpenseExcel);
router.get("/total/:userId", protect, getTotalExpense);
router.get("/monthly/:userId", protect, getMonthlyExpense);
router.get("/yearly/:userId", protect, getYearlyExpense);
router.delete("/:id", protect, deleteExpense);
router.put("/:id", protect, updateExpense);

module.exports = router;
