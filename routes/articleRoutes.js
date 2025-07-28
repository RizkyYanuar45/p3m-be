const express = require("express");
const router = express.Router();

const {
  getAllArticles,
  getArticleBySlug,
  getArticlesByType,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("./../controllers/articleController");
const { protectAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getAllArticles);
router.get("/slug/:slug", getArticleBySlug);
router.get("/type/:type", getArticlesByType);
router.post("/add", protectAdmin, upload.single("thumbnail"), createArticle);
router.patch(
  "/update/:id",
  protectAdmin,
  upload.single("thumbnail"),
  updateArticle
);
router.delete("/delete/:id", protectAdmin, deleteArticle);

module.exports = router;
