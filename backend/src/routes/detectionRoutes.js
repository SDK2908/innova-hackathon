const express = require("express");
const router = express.Router();

const {
  detectSubscriptions,
} = require("../controllers/detectionController");

router.post("/:userId", detectSubscriptions);

module.exports = router;