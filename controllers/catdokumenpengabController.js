const db = require("./../models");
const catDokumenPengab = db.catDokumenPengab;
const dokumenPengab = db.dokumenPengab;

exports.getAllCatDokumenPengab = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPengab.findAll();
    res.json(catdokumenpen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCatDokumenPengabWithHisDokumen = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPengab.findAll({
      include: [
        {
          model: dokumenPengab,
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

exports.getCatDokumenPengabById = async (req, res) => {
  try {
    const id = req.params.id;
    const catdokumenpen = await catDokumenPengab.findOne({
      where: { id: id },
      include: [
        {
          model: dokumenPengab,
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

exports.createCatDokumenPengab = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPengab.create(req.body);
    res.json(catdokumenpen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCatDokumenPengab = async (req, res) => {
  try {
    const catdokumenpen = await catDokumenPengab.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.json(catdokumenpen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCatDokumenPengab = async (req, res) => {
  try {
    await catDokumenPengab.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Cat Dokumen Pen deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
