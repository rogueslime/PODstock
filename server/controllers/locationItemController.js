const ItemsLocations = require('../models/Items_Locations.js');
const Location = require('../models/Locations');

exports.createLocationItem = async (req, res) => {
    try{
        const locationitem = await ItemsLocations.create(req.body);
        res.status(201).json(locationitem);
    } catch (err) {
        console.error('Error creating location item: ',err);
        res.status(500).json({ message: 'Server error creating location item. '});
    }
};

exports.getLocationItems = async (req, res) => {
    try {
        const locationitems = await ItemsLocations.find()
            .populate('item_id')
            .populate('location_id');
        res.status(200).json(locationitems);
    } catch (err) {
        console.error('Error getting location item: ',err);
        res.status(500).json({ message: 'Server error getting location item. '});
    }
};

exports.getLocationItemsById = async (req, res) => {
    try {
        const { locationId } = req.params;

        const locationItems = await ItemsLocations.find({ location_id: locationId })
            .populate('item_id')
            .populate('location_id')
        
        res.status(200).json(locationItems);
    } catch (err) {
        console.error('Error fetching location items: ',err);
        res.status(500).json({ message: 'Server error fetching location items.' });
    }
};

exports.updateLocationItem = async (req, res) => {
    try {
        const locationItem = await ItemsLocations.findByIdAndUpdate (
            req.params.id,
            req.body,
            { new: true }
        );
        if (!locationitem)
            return res.status(404).json({ error: "Location item not found." })
        res.status(200).json(locationItem);
    } catch (err) {
        console.error('Error updating location item: ',err);
        res.status(500).json({ message: 'Server error updating location item. '});
    }
};

exports.deleteLocationItem = async (req, res) => {
    try {
        const result = await ItemsLocation.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({message: "Location item not found." })
        res.status(200).json({ message: "Location item deleted." })
    } catch (err) {
        console.error('Error deleting location item: ', err);
        res.status(500).json({ message: 'Server error deleting location item.'});
    }
};