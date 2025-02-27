const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile details
router.get("/profile/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      email: user.email,
      nickname: user.nickname || user.hash, // Default to hash if no nickname
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Update or set a nickname
router.post("/profile/update-nickname", async (req, res) => {
  const { email, nickname } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.nickname = nickname || null; // Allow clearing nickname
    await user.save();

    res.json({
      message: "Nickname updated successfully",
      nickname: user.nickname || user.hash, // Ensure nickname is updated properly
    });
  } catch (error) {
    console.error("Error updating nickname:", error);
    res.status(500).json({ message: "Error updating nickname", error });
  }
});

module.exports = router;
