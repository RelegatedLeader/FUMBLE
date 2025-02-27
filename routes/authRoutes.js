const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate Random Hash
const generateHash = () => crypto.randomBytes(20).toString("hex");

// Send Hash to Email
router.post("/send-hash", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const hash = generateHash();
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // Hash expires in 1 month

  try {
    // Store hash in the database
    await User.findOneAndUpdate(
      { email },
      { hash, expiresAt },
      { upsert: true, new: true }
    );

    // Send email with the hash
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your FUMBLE Login Hash",
      text: `Use this hash to sign in: ${hash}`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Hash sent to email!" });
  } catch (error) {
    res.status(500).json({ message: "Error sending email", error });
  }
});

// Verify Hash for Login
router.post("/verify-hash", async (req, res) => {
  const { email, hash } = req.body;

  if (!email || !hash)
    return res.status(400).json({ message: "Email and hash are required" });

  try {
    const user = await User.findOne({ email, hash });

    if (!user) return res.status(401).json({ message: "Invalid hash" });

    if (new Date() > user.expiresAt) {
      return res.status(401).json({ message: "Hash expired" });
    }

    res.json({ message: "Login successful", token: hash }); // Use the hash as a simple token for now
  } catch (error) {
    res.status(500).json({ message: "Error verifying hash", error });
  }
});

module.exports = router;
