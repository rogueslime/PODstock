const express = require("express");
const router = express.Router();
const locationItemController = require("../controllers/locationItemController");

router.post("/", locationItemController.createLocationItem);
router.get("/", locationItemController.getLocationItems);
router.get("/:id",locationItemController.getLocationItemsById);
router.put("/:id",locationItemController.updateLocationItem);
router.delete("/:id", locationItemController.deleteLocationItem);

module.exports = router;