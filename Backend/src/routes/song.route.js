const express = require("express");
const Router = express.Router();
const songModel = require("../models/song.model");
const uploadImage = require("../Services/Storage.Service.js");
const multer = require("multer");
const { downloadMusic, deleteMusic } = require("../Services/Music.Service.js");
const { main } = require("../Services/MusicMood.Service.js");

const upload = multer({ storage: multer.memoryStorage() });

Router.post("/song", upload.single("audio"), async (req, res) => {
  try {
    const uploadResult = await uploadImage(req.file);
    const musicFileName = await downloadMusic(uploadResult.url);
    const aiMood = await main(musicFileName);
    deleteMusic(musicFileName);

    const { artist } = req.body;
    const newSong = await songModel.create({
      title: uploadResult.name,
      artist,
      url: uploadResult.url,
      mood: aiMood || "unknown", // Use AI mood or default to 'unknown'
    });

    res.status(200).json({
      message: "Audio uploaded successfully",
      data: newSong,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      message: "Audio upload failed",
      error: error.message,
    });
  }
});

Router.get("/song", async (req, res) => {
  const mood = req.query.mood; // Added const declaration
  try {
    const songs = await songModel.find({ mood: mood });
    res.status(200).json({
      message: "Songs fetched successfully",
      data: songs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Songs fetch failed",
      error: error,
    });
  }
});

module.exports = Router;
