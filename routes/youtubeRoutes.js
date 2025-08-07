const express = require("express");
const router = express.Router();
const { protectAdmin } = require("./../middleware/auth");
const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} = require("./../controllers/youtubeController");

router.get("/", getAllVideos);
router.get("/:id", getVideoById);
router.post("/add", protectAdmin, createVideo);
router.patch("/update/:id", protectAdmin, updateVideo);
router.delete("/delete/:id", protectAdmin, deleteVideo);
module.exports = router;
