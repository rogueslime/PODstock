const Item = require("../models/Items");

exports.createItem = async (req, res) => {
    const item = await Item.create(req.body);
    res.json(item);
};

exports.getItems = async (req, res) => {
    const items = await Item.find();
    res.json(items);
};

exports.getItemById = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
};

exports.updateItem = async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
}

exports.deleteItem = async (req, res) => {
    const result = await Item.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json ({ error: "Item not found." });
    res.json({ message: "Item deleted." });
}