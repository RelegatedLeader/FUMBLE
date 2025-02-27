const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const User = require("../models/User");

// Post a Comment
router.post("/add", async (req, res) => {
  const { videoId, userEmail, text } = req.body;

  if (!videoId || !userEmail || !text) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Fetch user's nickname or use their hash if no nickname is set
    const user = await User.findOne({ email: userEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const userName = user.nickname ? user.nickname : user.hash; // Fix: Ensure default value

    // Create a new comment
    const newComment = new Comment({ videoId, userEmail, userName, text });
    await newComment.save();

    res.json({ message: "Comment added successfully!", comment: newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error });
  }
});

// Get Comments for a Video
router.get("/:videoId", async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).sort({
      createdAt: -1,
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Error fetching comments", error });
  }
});

module.exports = router;
