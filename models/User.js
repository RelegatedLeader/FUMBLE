const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model("User", UserSchema);
