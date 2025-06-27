const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_login: { type: Date },
  is_active: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", UserSchema);