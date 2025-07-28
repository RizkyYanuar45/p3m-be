const express = require("express");
const router = express.Router();

const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} = require("./../controllers/adminController");
const { protectAdmin } = require("../middleware/auth");

router.get("/", protectAdmin, getAllAdmins);
router.get("/:id", protectAdmin, getAdminById);

module.exports = router;
