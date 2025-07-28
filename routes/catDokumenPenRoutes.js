const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");
const {
  getAllCatDokumenPen,
  getCatDokumenPenById,
  createCatDokumenPen,
  updateCatDokumenPen,
  deleteCatDokumenPen,
} = require("./../controllers/catdokumenpenController");

router.get("/", getAllCatDokumenPen);
router.get("/:id", getCatDokumenPenById);
router.post("/add", protectAdmin, createCatDokumenPen);
router.patch("/update/:id", protectAdmin, updateCatDokumenPen);
router.delete("/delete/:id", protectAdmin, deleteCatDokumenPen);

module.exports = router;
