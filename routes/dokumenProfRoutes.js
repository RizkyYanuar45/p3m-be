const express = require("express");
const router = express.Router();
const { protectAdmin } = require("../middleware/auth");

const {
  createDokumenProf,
  getAllDokumenProf,
  getDokumenProfById,
  updateDokumenProf,
  deleteDokumenProf,
} = require("../controllers/dokumenprofController");

router.post("/add", protectAdmin, createDokumenProf);
router.get("/", getAllDokumenProf);
router.get("/:id", getDokumenProfById);
router.patch("/update/:id", protectAdmin, updateDokumenProf);
router.delete("/delete/:id", protectAdmin, deleteDokumenProf);
module.exports = router;
