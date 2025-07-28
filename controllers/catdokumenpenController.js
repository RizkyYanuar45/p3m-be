const db = require("./../models");
const catDokumenPen = db.catDokumenPen;
const dokumenPen = db.dokumenPen;

exports.getAllCatDokumenPen = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPen.findAll();
    res.json(catdokumenpen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCatDokumenPenWithHisDokumen = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPen.findAll({
      include: [
        {
          model: dokumenPen,
          as: "dokumen",
          attributes: ["file_name", "file_url", "id"],
        },
      ],
    });
    res.json(catdokumenpen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCatDokumenPenById = async (req, res) => {
  try {
    const id = req.params.id;
    const catdokumenpen = await catDokumenPen.findOne({
      where: { id: id },
      include: [
        {
          model: dokumenPen,
          as: "dokumenpens",
          attributes: ["file_name", "file_url", "id"],
        },
      ],
    });
    if (!catdokumenpen) {
      return res.status(404).json({ message: "Cat Dokumen Pen not found" });
    }
    res.json(catdokumenpen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCatDokumenPen = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPen.create(req.body);
    res.json(catdokumenpen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCatDokumenPen = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPen.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json(catdokumenpen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCatDokumenPen = async (req, res) => {
  try {
    await catDokumenPen.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Cat Dokumen Pen deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
