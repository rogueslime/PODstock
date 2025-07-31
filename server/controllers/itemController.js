const Item = require("../models/Items");
const Case = require('../models/Cases');
const ItemsLocations = require('../models/Items_Locations');

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
    try {
        const itemId = req.params.id;
        await Case.deleteMany({ item_id: itemId });
        console.log('Case data deleted.');
        await ItemsLocations.deleteMany({ item_id: itemId });
        console.log('Item-location data deleted.');
        await Item.findByIdAndDelete(itemId);
        res.json({ message: 'Item and all related data deleted.' });
    } catch (err) {
        console.error('Error deleting item and/or associated data: ',err);
        res.status(500).json({error: 'Server error during delete.'});
    }
}