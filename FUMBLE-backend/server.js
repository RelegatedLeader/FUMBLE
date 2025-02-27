require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Debugging: Log MongoDB connection attempts
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if MongoDB fails to connect
  });

// Import routes
const authRoutes = require("../routes/authRoutes");
const profileRoutes = require("../routes/profileRoutes");
const videoRoutes = require("../routes/videoRoutes");
const commentRoutes = require("../routes/commentRoutes");

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/videos", videoRoutes);
app.use("/comments", commentRoutes);

app.get("/", (req, res) => {
  res.send("FUMBLE Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
