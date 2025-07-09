const Location = require('../models/Locations.js');

exports.createLocation = async (req, res) => {
    const location = await Location.create(req.body);
    res.json(location);
};

exports.getLocations = async (req, res) => {
    const locations = await Location.find();
    res.json(locations);
};

exports.getLocationById = async (req, res) => {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json(location);
};

exports.updateLocation = async (req, res) => {
    const location = await Location.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!location) return res.status(404).json({ error: "Location not found" });
    res.json(location);
}

exports.deleteLocation = async (req, res) => {
    const result = await Location.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json ({ error: "Location not found." });
    res.json({ message: "Location deleted." });
}