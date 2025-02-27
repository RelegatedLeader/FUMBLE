const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Send Hash to Email (Ensures User Is Created)
// Send Hash to Email (Debug User Creation)
router.post("/send-hash", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    let user = await User.findOne({ email });

    if (!user) {
      console.log(`🔍 Creating new user: ${email}`);
      user = new User({
        email,
        hash: require("crypto").randomBytes(20).toString("hex"),
        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      });

      await user.save();
      console.log(`✅ User created: ${user.email}`);
    } else {
      console.log(`ℹ️ User already exists: ${user.email}`);
    }

    res.json({ message: "Hash sent to email!" });
  } catch (error) {
    console.error("❌ Error saving user to database:", error);
    res.status(500).json({ message: "Error saving user", error });
  }
});

// Verify Hash for Login (Ensures User Exists)

// Debugging Logs
router.post("/verify-hash", async (req, res) => {
  const { email, hash } = req.body;

  console.log("🔍 Received login request:", req.body); // Log incoming request

  if (!email || !hash) {
    console.log("❌ Missing email or hash:", { email, hash });
    return res.status(400).json({ message: "Email and hash are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res
        .status(401)
        .json({ message: "User not found, request a new hash." });
    }

    if (user.hash !== hash) {
      console.log(
        `❌ Hash mismatch for ${email}. Expected: ${user.hash}, Received: ${hash}`
      );
      return res.status(401).json({ message: "Invalid hash" });
    }

    if (new Date() > user.expiresAt) {
      console.log(`❌ Hash expired for ${email}`);
      return res.status(401).json({ message: "Hash expired" });
    }

    console.log(`✅ User logged in successfully: ${email}`);
    res.json({ message: "Login successful", token: hash });
  } catch (error) {
    console.error("❌ Error verifying hash:", error);
    res.status(500).json({ message: "Error verifying hash", error });
  }
});

module.exports = router;
