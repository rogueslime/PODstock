const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const requireAuth = require('../middleware/auth');
const multer = require('multer');
const path = require ('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post("/", requireAuth, locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.put("/:id", requireAuth, locationController.updateLocation);
router.delete("/:id", requireAuth, locationController.deleteLocation);
router.post("/:id/image", requireAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imagePath = `/uploads/images/${req.file.filename}`;
        
        // Update the location with the image path
        const updatedLocation = await locationController.attachImageToLocation(req.params.id, imagePath);

        res.json({ message: "Image uploaded", imagePath, location: updatedLocation });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: "Server error while uploading image" });
    }
});

module.exports = router;