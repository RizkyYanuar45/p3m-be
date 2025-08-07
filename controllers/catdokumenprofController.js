const db = require("../models");
const catDokumenProf = db.catDokumenProf;
const dokumenProf = db.dokumenProf;

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await catDokumenProf.create({ name: name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await catDokumenProf.findAll({
      include: [
        {
          model: dokumenProf,
          as: "dokumen",
          attributes: ["file_name", "file_url", "id"],
        },
      ],
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await catDokumenProf.findOne({
      where: { id },
      include: [
        {
          model: dokumenProf,
          as: "dokumen",
          attributes: ["file_name", "file_url", "id"],
        },
      ],
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const category = await catDokumenProf.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    category.name = name;
    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await catDokumenProf.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
