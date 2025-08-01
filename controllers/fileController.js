const db = require("../models");
const fs = require("fs").promises;
const path = require("path");
const File = db.file;

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll();
    res.status(200).json(files);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching files", error: error.message });
  }
};
exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ where: { id } });
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching file", error: error.message });
  }
};
exports.getFileByType = async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res
        .status(400)
        .json({ message: "Query parameter 'type' is required" });
    }

    const files = await File.findAll({ where: { file_type: type } });

    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching files by type:", error);
    res
      .status(500)
      .json({ message: "Error fetching files by type", error: error.message });
  }
};
exports.createFile = async (req, res) => {
  try {
    const file = await File.create(req.body);
    res.status(201).json(file);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating file", error: error.message });
  }
};
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await File.update(req.body, {
      where: { id: id },
    });
    if (updated) {
      const updatedFile = await File.findOne({ where: { id } });
      res.status(200).json(updatedFile);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating file", error: error.message });
  }
};
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await File.destroy({
      where: { id: id },
    });
    if (deleted) {
      res.status(204).send({ message: "berhasil dihapus" });
    } else {
      res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting file", error: error.message });
  }
};
