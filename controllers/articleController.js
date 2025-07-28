const db = require("./../models");
const fs = require("fs").promises;
const path = require("path");
const Article = db.Article;
const slugify = require("slugify");

// ✅ PERBAIKAN: Async function dengan proper await dan limit
const generateUniqueSlug = async (name) => {
  try {
    let baseSlug = slugify(name, {
      replacement: "-",
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let slugCount = 1;
    const MAX_ATTEMPTS = 100; // Prevent infinite loop

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      // ✅ PERBAIKAN: Tambahkan await
      const existingArticle = await Article.findOne({
        where: { slug: slug },
        timeout: 5000, // 5 second timeout
      });

      if (!existingArticle) {
        return slug; // Slug is unique
      }

      // Generate new slug with counter
      slug = `${baseSlug}-${slugCount}`;
      slugCount++;
    }

    // Fallback if max attempts reached
    return `${baseSlug}-${Date.now()}`;
  } catch (error) {
    console.error("Error generating unique slug:", error);
    // Fallback to timestamp-based slug
    return `${slugify(name)}-${Date.now()}`;
  }
};

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

exports.getArticlesByType = async (req, res) => {
  try {
    const articles = await Article.findAll({
      where: { category: req.params.type },
    });
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles by type:", error);
    res.status(500).json({ message: "Error fetching articles" });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findOne({
      where: { slug: req.params.slug },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article by slug:", error);
    res.status(500).json({ message: "Error fetching article" });
  }
};

exports.createArticle = async (req, res) => {
  let uploadedFilePath = null;

  try {
    console.log("=== CREATE ARTICLE DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    const { title, content, author, category } = req.body;
    uploadedFilePath = req.file ? req.file.path : null;

    // Validation
    if (!title) {
      // Clean up uploaded file if validation fails
      if (uploadedFilePath) {
        try {
          await fs.unlink(uploadedFilePath);
          console.log("Cleaned up uploaded file due to validation error");
        } catch (unlinkError) {
          console.error("Error cleaning up file:", unlinkError);
        }
      }
      return res.status(400).json({ message: "Title is required" });
    }

    console.log("Generating slug for title:", title);

    // ✅ PERBAIKAN: Await the async function
    const slug = await generateUniqueSlug(title);

    console.log("Generated slug:", slug);

    const newArticleData = {
      title,
      slug,
      content: content || "",
      thumbnail: uploadedFilePath,
      author: author || "Anonymous",
      category: category || "Uncategorized",
    };

    console.log("Data to be created:", newArticleData);

    // Add timeout protection for database operation
    const article = await Promise.race([
      Article.create(newArticleData),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database operation timeout")), 15000)
      ),
    ]);

    console.log("Article created successfully with ID:", article.id);

    res.status(201).json({
      success: true,
      message: "Article created successfully",
      data: article,
    });
  } catch (error) {
    console.error("ERROR CREATING ARTICLE:", error);

    // Clean up uploaded file if there's an error
    if (uploadedFilePath) {
      try {
        const fsSync = require("fs");
        if (fsSync.existsSync(uploadedFilePath)) {
          await fs.unlink(uploadedFilePath);
          console.log("Cleaned up uploaded file due to error");
        }
      } catch (unlinkError) {
        console.error("Error cleaning up file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error creating article",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

exports.updateArticle = async (req, res) => {
  let newThumbnailPath = null;

  try {
    console.log("=== UPDATE ARTICLE DEBUG ===");
    console.log("Article ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);

    // 1. Find article to update
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      // Clean up new uploaded file if article not found
      if (req.file) {
        try {
          await fs.unlink(req.file.path);
          console.log("Cleaned up new file - article not found");
        } catch (unlinkError) {
          console.error("Error cleaning up new file:", unlinkError);
        }
      }
      return res.status(404).json({ message: "Article not found" });
    }

    // 2. Store old thumbnail path
    const oldThumbnailPath = article.thumbnail;
    newThumbnailPath = req.file ? req.file.path : null;

    // 3. Prepare update data
    const { title, content, author, category } = req.body;
    const updatedData = {};

    // Only update fields that are provided
    if (title !== undefined) updatedData.title = title;
    if (content !== undefined) updatedData.content = content;
    if (author !== undefined) updatedData.author = author;
    if (category !== undefined) updatedData.category = category;

    // Update slug if title changed
    if (title && title !== article.title) {
      console.log("Title changed, generating new slug");
      updatedData.slug = await generateUniqueSlug(title);
      console.log("New slug:", updatedData.slug);
    }

    // Add new thumbnail if uploaded
    if (newThumbnailPath) {
      updatedData.thumbnail = newThumbnailPath;
    }

    console.log("Update data:", updatedData);

    // 4. Update article in database
    await Article.update(updatedData, {
      where: { id: req.params.id },
    });

    // 5. Delete old thumbnail if new one was uploaded
    if (newThumbnailPath && oldThumbnailPath) {
      try {
        const fsSync = require("fs");
        if (fsSync.existsSync(oldThumbnailPath)) {
          await fs.unlink(path.resolve(oldThumbnailPath));
          console.log("Deleted old thumbnail successfully");
        }
      } catch (unlinkError) {
        console.error("Error deleting old thumbnail:", unlinkError.message);
      }
    }

    // 6. Get updated article
    const updatedArticle = await Article.findByPk(req.params.id);

    console.log("Article updated successfully");

    res.status(200).json({
      success: true,
      message: "Article updated successfully",
      data: updatedArticle,
    });
  } catch (error) {
    console.error("ERROR UPDATING ARTICLE:", error);

    // Clean up new thumbnail if there's an error
    if (newThumbnailPath) {
      try {
        const fsSync = require("fs");
        if (fsSync.existsSync(newThumbnailPath)) {
          await fs.unlink(newThumbnailPath);
          console.log("Cleaned up new thumbnail due to error");
        }
      } catch (unlinkError) {
        console.error("Error cleaning up new thumbnail:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error updating article",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    console.log("=== DELETE ARTICLE DEBUG ===");
    console.log("Article ID:", req.params.id);

    // Find article first to get thumbnail path
    const article = await Article.findByPk(req.params.id);

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const thumbnailPath = article.thumbnail;

    // Delete from database
    const deletedCount = await Article.destroy({
      where: { id: req.params.id },
    });

    // Delete thumbnail file if exists
    if (thumbnailPath) {
      try {
        const fsSync = require("fs");
        if (fsSync.existsSync(thumbnailPath)) {
          await fs.unlink(thumbnailPath);
          console.log("Deleted thumbnail file successfully");
        }
      } catch (unlinkError) {
        console.error("Error deleting thumbnail:", unlinkError.message);
      }
    }

    if (deletedCount > 0) {
      console.log("Article deleted successfully");
      res.status(200).json({
        success: true,
        message: "Article deleted successfully",
        data: { deletedCount },
      });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    console.error("ERROR DELETING ARTICLE:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting article",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
