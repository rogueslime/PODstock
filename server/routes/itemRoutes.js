const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const requireAuth = require('../middleware/auth');

router.post("/", requireAuth, itemController.createItem);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);
router.put("/:id", requireAuth, itemController.updateItem);
router.delete("/:id", requireAuth, itemController.deleteItem);

module.exports = router;