const db = require("../models");
const dokumenProf = db.dokumenProf;
const catDokumenProf = db.catDokumenProf;

exports.createDokumenProf = async (req, res) => {
  try {
    const { file_name, file_url, catdokumenprofId } = req.body;
    const newDokumenProf = await dokumenProf.create({
      file_name,
      file_url,
      catdokumenprofId,
    });
    res.status(201).json(newDokumenProf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDokumenProf = async (req, res) => {
  try {
    const dokumenProfs = await dokumenProf.findAll({
      include: [
        {
          model: catDokumenProf,
          as: "kategori",
          attributes: ["name", "id"],
        },
      ],
    });
    res.json(dokumenProfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDokumenProfById = async (req, res) => {
  try {
    const id = req.params.id;
    const dokumenProfItem = await dokumenProf.findOne({
      where: { id },
      include: [
        {
          model: catDokumenProf,
          as: "kategori",
          attributes: ["name", "id"],
        },
      ],
    });
    if (!dokumenProfItem) {
      return res.status(404).json({ message: "Dokumen Prof not found" });
    }
    res.json(dokumenProfItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDokumenProf = async (req, res) => {
  try {
    const id = req.params.id;
    const { file_name, file_url, catdokumenprofId } = req.body;
    const dokumenProfItem = await dokumenProf.findByPk(id);
    if (!dokumenProfItem) {
      return res.status(404).json({ message: "Dokumen Prof not found" });
    }
    dokumenProfItem.file_name = file_name;
    dokumenProfItem.file_url = file_url;
    if (catdokumenprofId) {
      dokumenProfItem.catdokumenprofId = catdokumenprofId;
    }
    await dokumenProfItem.save();
    res.json(dokumenProfItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteDokumenProf = async (req, res) => {
  try {
    const id = req.params.id;
    const dokumenProfItem = await dokumenProf.findByPk(id);
    if (!dokumenProfItem) {
      return res.status(404).json({ message: "Dokumen Prof not found" });
    }
    await dokumenProfItem.destroy();
    res.status(200).json({ message: "Dokumen Prof deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
