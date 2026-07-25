const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// Accept only CSV files
const fileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() !== ".csv") {
    return cb(new Error("Only CSV files are allowed."));
  }

  cb(null, true);
};

module.exports = multer({
  storage,
  fileFilter,
});