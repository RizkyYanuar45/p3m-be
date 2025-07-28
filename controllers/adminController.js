const bcrypt = require("bcrypt");
const db = require("./../models");
const Admin = db.Admin;

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admins", error: error.message });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOne({ where: { id: id } });
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching admin", error: error.message });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashedPassword });
    res.status(201).json(admin);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin", error: error.message });
  }
};
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const [updated] = await Admin.update(
      { name, email, password: hashedPassword },
      { where: { id } }
    );

    if (updated) {
      const updatedAdmin = await Admin.findOne({ where: { id } });
      res.status(200).json(updatedAdmin);
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating admin", error });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.destroy({
      where: { id },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Admin not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting admin", error });
  }
};
