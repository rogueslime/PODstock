const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
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

router.post("/", requireAuth, itemController.createItem);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);
router.put("/:id", requireAuth, itemController.updateItem);
router.delete("/:id", requireAuth, itemController.deleteItem);
router.post("/:id/image", requireAuth, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const imagePath = `/uploads/images/${req.file.filename}`;
        
        // Update the location with the image path
        const updatedItem = await itemController.attachImageToItem(req.params.id, imagePath);

        res.json({ message: "Image uploaded", imagePath, item: updatedItem });
    } catch (err) {
        console.error("Error uploading image:", err);
        res.status(500).json({ error: "Server error while uploading image" });
    }
});

module.exports = router;