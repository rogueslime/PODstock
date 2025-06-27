const mongoose = require("mongoose");

const TransactionLogSchema = new mongoose.Schema({
  item_id: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  delta_count: { type: Number, required: true }, // positive or negative
  posted_at: { type: Date, default: Date.now },
  reason: { type: String }
});

module.exports = mongoose.model("TransactionLog", TransactionLogSchema);