const db = require("../models");
const Form = db.Form;

exports.createForm = async (req, res) => {
  try {
    const form = req.body;

    const isAlreadyExists = await Form.findOne({ where: { type: form.type } });
    if (isAlreadyExists) {
      return res.status(400).json({ message: "Form type already exists" });
    }
    await Form.create(form);

    res.status(201).json(form);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating form", error: error.message });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.findAll();
    res.status(200).json(forms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forms", error: error.message });
  }
};
exports.getFormById = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findOne({ where: { id } });
    if (form) {
      res.status(200).json(form);
    } else {
      res.status(404).json({ message: "Form not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching form", error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await form.update(req.body);
    res.status(200).json(form);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating form", error: error.message });
  }
};
exports.deleteForm = async (req, res) => {
  try {
    const { id } = req.params;
    const form = await Form.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    await form.destroy();
    res.status(200).json({ message: "Form deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting form", error: error.message });
  }
};

exports.getFormsByType = async (req, res) => {
  try {
    const type = req.query.type;
    if (!type) {
      return res
        .status(400)
        .json({ message: "Query parameter 'type' is required" });
    }
    const forms = await Form.findAll({ where: { type } });
    if (forms.length === 0) {
      return res.status(404).json({ message: "No forms found for this type" });
    }
    res.status(200).json(forms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching forms by type", error: error.message });
  }
};
