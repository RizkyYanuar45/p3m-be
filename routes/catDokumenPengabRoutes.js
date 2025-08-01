const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");
const {
  getAllCatDokumenPengab,
  getCatDokumenPengabById,
  createCatDokumenPengab,
  updateCatDokumenPengab,
  getAllCatDokumenPengabWithHisDokumen,
  deleteCatDokumenPengab,
} = require("./../controllers/catdokumenpengabController");

router.get("/", getAllCatDokumenPengab);
router.get("/:id", getCatDokumenPengabById);
router.post("/add", protectAdmin, createCatDokumenPengab);
router.patch("/update/:id", protectAdmin, updateCatDokumenPengab);
router.delete("/delete/:id", protectAdmin, deleteCatDokumenPengab);

module.exports = router;
