const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");

const {
  getAllDokumenPen,
  getDokumenPenById,
  createDokumenPen,
  updateDokumenPen,
  deleteDokumenPen,
} = require("./../controllers/dokumenpenController");

router.get("/", getAllDokumenPen);
router.get("/:id", getDokumenPenById);
router.post("/add", protectAdmin, createDokumenPen);
router.patch("/update/:id", protectAdmin, updateDokumenPen);
router.delete("/delete/:id", protectAdmin, deleteDokumenPen);

module.exports = router;
