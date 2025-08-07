const express = require("express");
const router = express.Router();
const { protectAdmin } = require("./../middleware/auth");

const {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  getFormsByType,
} = require("./../controllers/formController");

router.get("/", getAllForms);
router.get("/:id", getFormById);
router.post("/add", protectAdmin, createForm);
router.patch("/update/:id", protectAdmin, updateForm);
router.delete("/delete/:id", protectAdmin, deleteForm);
router.get("/type", getFormsByType); // New route to get forms by type

module.exports = router;
