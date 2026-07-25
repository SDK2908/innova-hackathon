const express = require("express");

const router = express.Router();

const { runAgent } = require("../controllers/aiController");

// POST /api/ai/run
router.post("/run", runAgent);

module.exports = router;