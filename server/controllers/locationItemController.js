const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const ItemsLocations = require('../models/Items_Locations.js');
const Location = require('../models/Locations');
const Case = require ('../models/Cases');
const Item = require ('../models/Items');

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
        const { id } = req.params;

        const locationItems = await ItemsLocations.find({ location_id: id })
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
        if (!locationItem)
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

// special route for handling daily operations
exports.dailyOperations = async (req, res) => {
    console.log('Uploaded file info: ',req.file);
    const locationId = req.params.locationId;
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('Filepath saved at... ', filePath);

    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', data => results.push(data))
        .on('end', async () => {
            try {
                for(const entry of results) {
                    const itemLabel = entry.item_label;
                    const itemQuantity = parseInt(entry.quantity);

                    const foundItem = await Item.findOne({ name: itemLabel });
                    if (!foundItem) {
                        console.log('item ',itemLabel, ' missed - missing item.');
                        continue;
                    }
                    
                    await ItemsLocations.findOneAndUpdate (
                        { item_id: foundItem._id, location_id: locationId },
                        { $inc: { count: itemQuantity }, updated_at: new Date() },
                        { upsert: true, new: true }
                    );
                }
                res.json({ message: 'Daily ops imported.' });
            } catch (err) {
                console.error('Daily ops import error: ',err);
                res.status(500).json({ error: 'Import error.' });
            } finally {
                fs.unlinkSync(filePath);
            }
        });
}

// special route for handling shipment imports
exports.importShipment = async (req, res) => {
    console.log('Uploaded file info: ',req.file);
    const locationId = req.params.locationId;
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log("Filepath saved at... ", filePath);

    const results = [];
    const successes = [];
    const errors = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', data => results.push(data))
        .on('end', async () => {
            try {
                for(const entry of results) {
                    const caseLabel = entry.case_label;
                    const caseQuantity = parseInt(entry.quantity);

                    /*if (!caseLabel) {
                        errors.push({
                            caseLabel: caseLabel || '(missing)',
                            reason: 'Invalid or missing case label.',
                        });
                        continue;
                    }*/

                    const foundCase = await Case.findOne({ name: caseLabel }).populate('item_id');
                    if (!foundCase || !foundCase.item_id) {
                        console.log('case ',caseLabel, ' missed - missing case or item.');
                        errors.push({
                            caseLabel: caseLabel,
                            reason: 'Invalid or missing case label.',
                        });
                        continue;
                    }

                    const totalItems = foundCase.itemcount * caseQuantity;
                    
                    await ItemsLocations.findOneAndUpdate (
                        { item_id: foundCase.item_id._id, location_id: locationId },
                        { $inc: { count: totalItems }, updated_at: new Date() },
                        { upsert: true, new: true }
                    );

                    successes.push({
                        caseLabel,
                        itemName: foundCase.item_id.name,
                        quantityAdded: totalItems,
                    });
                }

                res.json({ 
                    message: 'Shipment imported.',
                    successes,
                    errors,
                });
            } catch (err) {
                console.error('Shipment import error: ',err);
                res.status(500).json({ error: 'Import error.' });
            } finally {
                fs.unlinkSync(filePath);
            }
        });
};