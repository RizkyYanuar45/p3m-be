const express = require("express");
const router = express.Router();
const { protectAdmin } = require("./../middleware/auth");

const {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} = require("./../controllers/profileController");
const upload = require("../middleware/upload");

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.post("/add", protectAdmin, upload.single("image"), createProfile);
router.patch(
  "/update/:id",
  protectAdmin,
  upload.single("image"),
  updateProfile
);
router.delete("/delete/:id", protectAdmin, deleteProfile);

module.exports = router;
