const db = require("./../models");
const catdokumenpengab = db.catDokumenPengab;
const dokumenpengab = db.dokumenPengab;

exports.getAllDokumenPengab = async (req, res) => {
  try {
    const dokumenPens = await dokumenpengab.findAll({
      include: [
        {
          model: catdokumenpengab,
          as: "kategori",
          attributes: ["name", "id"],
        },
      ],
    });
    res.json(dokumenPens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDokumenPengabById = async (req, res) => {
  try {
    const id = req.params.id;
    const dokumenPengab = await dokumenpengab.findByPk(id, {
      include: [
        {
          model: catdokumenpengab,
          as: "kategori",
          attributes: ["name", "id"],
        },
      ],
    });
    if (!dokumenPengab) {
      return res.status(404).json({ message: "Dokumen Pen tidak ditemukan" });
    }
    res.json(dokumenPengab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDokumenPengab = async (req, res) => {
  try {
    const { file_name, file_url, catdokumenpengabId } = req.body;
    const dokumenPengab = await dokumenpengab.create({
      file_name,
      file_url,
      catdokumenpengabId,
    });
    res.json(dokumenPengab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDokumenPengab = async (req, res) => {
  try {
    const id = req.params.id;
    const { file_name, file_url, catdokumenpengabId } = req.body;
    const dokumenPengab = await dokumenpengab.findByPk(id);
    if (!dokumenPengab) {
      return res.status(404).json({ message: "Dokumen Pen tidak ditemukan" });
    }
    await dokumenPengab.update({
      file_name,
      file_url,
      catdokumenpengabId,
    });
    res.json(dokumenPengab);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDokumenPengab = async (req, res) => {
  try {
    const id = req.params.id;
    await dokumenpengab.destroy({ where: { id } });
    res.json({ message: "Dokumen Pen berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
