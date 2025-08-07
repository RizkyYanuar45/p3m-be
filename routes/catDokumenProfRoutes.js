const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/catdokumenprofController");

router.post("/add", protectAdmin, createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.patch("/update/:id", protectAdmin, updateCategory);
router.delete("/delete/:id", protectAdmin, deleteCategory);
module.exports = router;
