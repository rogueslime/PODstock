const mongoose = require("mongoose");

const ItemLocationSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  count: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ItemLocation", ItemLocationSchema);