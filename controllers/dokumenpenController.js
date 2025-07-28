const catdokumenpen = require("../models/catdokumenpen");
const dokumenpen = require("./../models/dokumenpen");

exports.getAllDokumenPen = async (req, res) => {
  try {
    const dokumenPens = await dokumenpen.findAll({
      include: [
        {
          model: catdokumenpen,
          as: "kategori_dokumen",
          attributes: ["name"],
        },
      ],
    });
    res.json(dokumenPens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDokumenPenById = async (req, res) => {
  try {
    const id = req.params.id;
    const dokumenPen = await dokumenpen.findByPk(id, {
      include: [
        {
          model: catdokumenpen,
          as: "kategori_dokumen",
          attributes: ["name"],
        },
      ],
    });
    if (!dokumenPen) {
      return res.status(404).json({ message: "Dokumen Pen tidak ditemukan" });
    }
    res.json(dokumenPen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDokumenPen = async (req, res) => {
  try {
    const { file_name, file_url, catdokumenpenId } = req.body;
    const dokumenPen = await dokumenpen.create({
      file_name,
      file_url,
      catdokumenpenId,
    });
    res.json(dokumenPen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDokumenPen = async (req, res) => {
  try {
    const id = req.params.id;
    const { file_name, file_url, catdokumenpenId } = req.body;
    const dokumenPen = await dokumenpen.findByPk(id);
    if (!dokumenPen) {
      return res.status(404).json({ message: "Dokumen Pen tidak ditemukan" });
    }
    await dokumenPen.update({
      file_name,
      file_url,
      catdokumenpenId,
    });
    res.json(dokumenPen);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDokumenPen = async (req, res) => {
  try {
    const id = req.params.id;
    await dokumenpen.destroy({ where: { id } });
    res.json({ message: "Dokumen Pen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
