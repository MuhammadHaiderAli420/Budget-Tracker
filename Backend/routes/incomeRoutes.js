const express = require("express")

const {
  addIncome,
  getAllIncome,
  deleteIncome,
  downloadIncomeExcel,
  updateIncome 
} = require("../controllers/incomeController");


const { protect } = require("../middleware/authMiddleware")

const router = express.Router()

router.post("/add", protect, addIncome)
router.get("/get", protect, getAllIncome)
router.get("/downloadExcel", protect, downloadIncomeExcel)
router.put("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);


module.exports = router