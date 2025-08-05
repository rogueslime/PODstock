const Location = require('../models/Locations.js');
const ItemsLocations = require ('../models/Items_Locations.js');

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
    try {
        await ItemsLocations.deleteMany({ location_id: req.params.id });
        console.log('Item-location data deleted.');
        await Location.findByIdAndDelete(req.params.id);
        res.json({ message: 'Location deleted.' });
    } catch (err) {
        console.error('Error deleting location or associated data: ',err);
        res.status(500).json({error: 'Server error during delete.'});
    }
}

exports.attachImageToLocation = async (locationId, imagePath) => {
    const location = await Location.findById(locationId);
    if (!location) throw new Error("Location not found");

    location.image = imagePath;
    location.updated_at = new Date();
    await location.save();
    return location;
};