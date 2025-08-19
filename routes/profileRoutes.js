const express = require("express");
const router = express.Router();
const { protectAdmin } = require("./../middleware/auth");

const {
  getAllProfiles,
  getProfileById,
  getProfilebyType,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("./../controllers/profileController");
const uploadAndCompress = require("../middleware/upload");

router.get("/type", getProfilebyType);
router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.post("/add", protectAdmin, uploadAndCompress("image"), createProfile);
router.patch(
  "/update/:id",
  protectAdmin,
  uploadAndCompress("image"),
  updateProfile
);
router.delete("/delete/:id", protectAdmin, deleteProfile);

module.exports = router;
