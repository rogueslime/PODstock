const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");
const requireAuth = require('../middleware/auth');

router.post("/", requireAuth, caseController.createCase);
router.get("/", caseController.getCases);
router.get("/:id", caseController.getCaseById);
router.put("/:id", requireAuth, caseController.updateCase);
router.delete("/:id", requireAuth, caseController.deleteCase);

module.exports = router;