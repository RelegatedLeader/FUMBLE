const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/Video");
const path = require("path");

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload Video Route
router.post("/upload", upload.single("video"), async (req, res) => {
  const { title, userEmail } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: "No video file uploaded" });
  }

  try {
    const video = new Video({
      title,
      filename: req.file.filename,
      filePath: req.file.path,
      userEmail,
    });

    await video.save();
    res.json({ message: "Video uploaded successfully!", video });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
});

// Get All Videos
router.get("/", async (req, res) => {
  try {
    console.log("Fetching videos..."); // Debugging log
    const videos = await Video.find().sort({ uploadedAt: -1 });
    console.log("Videos found:", videos); // Debugging log
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Error fetching videos", error });
  }
});

// Get a Specific Video by ID
router.get("/videos/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    res.json(video);
  } catch (error) {
    res.status(500).json({ message: "Error fetching video", error });
  }
});

module.exports = router;
