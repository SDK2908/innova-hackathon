const express = require("express");
const router = express.Router();

const {
  uploadTransactions,
} = require("../controllers/transactionController");

const upload = require("../middleware/uploadMiddleware");

router.post(
    "/upload",
    upload.single("file"),
    uploadTransactions
);

module.exports = router;