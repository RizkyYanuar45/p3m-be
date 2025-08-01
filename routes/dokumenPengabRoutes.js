const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");

const {
  getAllDokumenPengab,
  getDokumenPengabById,
  createDokumenPengab,
  updateDokumenPengab,
  deleteDokumenPengab,
} = require("./../controllers/dokumenpengabController");

router.get("/", getAllDokumenPengab);
router.get("/:id", getDokumenPengabById);
router.post("/add", protectAdmin, createDokumenPengab);
router.patch("/update/:id", protectAdmin, updateDokumenPengab);
router.delete("/delete/:id", protectAdmin, deleteDokumenPengab);

module.exports = router;
