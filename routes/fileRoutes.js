const express = require("express");
const router = express.Router();
const { protectAdmin } = require("./../middleware/auth");

const {
  getAllFiles,
  getFileByType,
  getFileById,
  createFile,
  updateFile,
  deleteFile,
} = require("./../controllers/fileController");

router.get("/", getAllFiles);
router.get("/type", getFileByType);
router.get("/:id", getFileById);
router.post("/add", protectAdmin, createFile);
router.patch("/update/:id", protectAdmin, updateFile);
router.delete("/delete/:id", protectAdmin, deleteFile);

module.exports = router;
