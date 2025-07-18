const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const locationItemController = require("../controllers/locationItemController");
const requireAuth = require('../middleware/auth');

// multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({
    dest: path.join(__dirname, '../uploads'),
});

// basic location item control routes
router.post("/", requireAuth, locationItemController.createLocationItem);
router.get("/", locationItemController.getLocationItems);
router.get("/:id",locationItemController.getLocationItemsById);
router.put("/:id", requireAuth,locationItemController.updateLocationItem);
router.delete("/:id", requireAuth, locationItemController.deleteLocationItem);

// routes for csv imports
router.post('/import-shipment/:locationId', upload.single('file'), locationItemController.importShipment);
router.post('/daily-operations/:locationId', upload.single('file'), locationItemController.dailyOperations);

module.exports = router;