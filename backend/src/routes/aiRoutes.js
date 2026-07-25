const express = require("express");

const router = express.Router();

const {
  analyzePortfolio,
} = require("../controllers/aiController");

// Analyze subscription portfolio
router.post("/analyze", analyzePortfolio);

module.exports = router;