const express = require("express");
const router = express.Router();

const {
  getAllLeaks,
  getLeakById,
  performLeakAction,
} = require("../controllers/leakController");

router.get("/", getAllLeaks);

router.get("/:id", getLeakById);

router.post("/:id/action", performLeakAction);

module.exports = router;