const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true }, // Nickname or hash
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", CommentSchema);
