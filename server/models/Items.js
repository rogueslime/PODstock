const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    image: { type: String, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now}
});

module.exports = mongoose.model("Item", ItemSchema);