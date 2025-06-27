const Item = require("../models/Items");

exports.createItem = async (req, res) => {
    const item = await Item.create(req.body);
    res.json(item);
};

exports.getItems = async (req, res) => {
    const items = await Item.find();
    res.json(items);
};