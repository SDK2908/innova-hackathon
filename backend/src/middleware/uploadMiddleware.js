const multer = require("multer");
const path = require("path");

// Store uploaded files inside /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
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

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;