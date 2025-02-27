require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("../routes/authRoutes");
app.use("/auth", authRoutes);

const videoRoutes = require("../routes/videoRoutes");
app.use("/videos", videoRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded videos

app.get("/", (req, res) => {
  res.send("FUMBLE Backend is Running!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
