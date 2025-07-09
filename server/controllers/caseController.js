const Case = require("../models/Cases");

exports.createCase = async (req, res) => {
    try {
        const newCase = await Case.create(req.body);
        res.status(201).json(newCase);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCases = async (req, res) => {
    try {
        const cases = await Case.find().populate("item_id");
        res.json(cases);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCaseById = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id).populate("item_id");
        if (!caseItem) return res.status(404).json({ error: "Case not found" });
        res.json(caseItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCase = async (req, res) => {
    try {
        const updated = await Case.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCase = async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: "Case deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};