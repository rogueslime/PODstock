const express = require("express");
const router = express.Router();
const caseController = require("../controllers/caseController");

router.post("/", caseController.createCase);
router.get("/", caseController.getCases);
router.get("/:id", caseController.getCaseById);
router.put("/:id", caseController.updateCase);
router.delete("/:id", caseController.deleteCase);

module.exports = router;