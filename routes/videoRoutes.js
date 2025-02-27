const express = require("express");
const router = express.Router();
const multer = require("multer");
const Video = require("../models/Video");
const User = require("../models/User"); // Import User model
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
    // Fetch user's nickname (or use their email hash if no nickname is set)
    const user = await User.findOne({ email: userEmail });
    const uploaderName = user && user.nickname ? user.nickname : userEmail;

    // Save video to database
    const video = new Video({
      title,
      filename: req.file.filename,
      filePath: req.file.path,
      userEmail,
      uploaderName,
    });

    await video.save();
    res.json({ message: "Video uploaded successfully!", video });
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error });
  }
});

// Get All Videos (Sorted by Newest First)
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos", error });
  }
});

module.exports = router;
