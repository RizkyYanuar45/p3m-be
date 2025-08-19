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
const uploadAndCompress = require("../middleware/upload");

router.get("/", getAllArticles);
router.get("/slug/:slug", getArticleBySlug);
router.get("/type/:type", getArticlesByType);
router.post(
  "/add",
  protectAdmin,
  uploadAndCompress("thumbnail"),
  createArticle
);
router.patch(
  "/update/:id",
  protectAdmin,
  uploadAndCompress("thumbnail"),
  updateArticle
);
router.delete("/delete/:id", protectAdmin, deleteArticle);

module.exports = router;
