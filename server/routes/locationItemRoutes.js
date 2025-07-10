const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const locationItemController = require("../controllers/locationItemController");

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
router.post("/", locationItemController.createLocationItem);
router.get("/", locationItemController.getLocationItems);
router.get("/:id",locationItemController.getLocationItemsById);
router.put("/:id",locationItemController.updateLocationItem);
router.delete("/:id", locationItemController.deleteLocationItem);

// routes for csv imports
router.post('/import-shipment/:locationId', upload.single('file'), locationItemController.importShipment);
router.post('/daily-operations/:locationId', upload.single('file'), locationItemController.dailyOperations);

module.exports = router;