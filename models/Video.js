const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  userEmail: { type: String, required: true },
  uploaderName: { type: String, required: true }, // Stores nickname or hash
});

module.exports = mongoose.model("Video", VideoSchema);
