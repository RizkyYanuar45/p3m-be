const db = require("../models");
const Youtube = db.Youtube;
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Youtube.findAll();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
};
exports.getVideoById = async (req, res) => {
  try {
    const video = await Youtube.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error });
  }
};
exports.createVideo = async (req, res) => {
  try {
    const { title, link } = req.body;
    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }
    const newVideo = await Youtube.create({ title, link });
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: "Error creating video", error });
  }
};
exports.updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link } = req.body;
    const video = await Youtube.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.title = title || video.title;
    video.link = link || video.link;
    await video.save();
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: "Error updating video", error });
  }
};
exports.deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Youtube.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    await video.destroy();
    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting video", error });
  }
};
