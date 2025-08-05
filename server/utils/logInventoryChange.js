const InventoryTxn = require('../models/Inventory_Transaction_Log');

module.exports = async ({ userId, itemId, locationId, delta, reason }) =>
    InventoryTxn.create({
        account_id: userId,
        item_id: itemId,
        location_id: locationId,
        delta_count: delta,
        posted_at: new Date(),
        reason
    });