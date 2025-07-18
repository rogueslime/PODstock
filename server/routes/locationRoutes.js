const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const requireAuth = require('../middleware/auth');

router.post("/", requireAuth, locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/:id", locationController.getLocationById);
router.put("/:id", requireAuth, locationController.updateLocation);
router.delete("/:id", requireAuth, locationController.deleteLocation);

module.exports = router;