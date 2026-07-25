const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const transactionRoutes = require("./routes/transactionRoutes");
const leakRoutes = require("./routes/leakRoutes");
const detectionRoutes = require("./routes/detectionRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/transactions", transactionRoutes);
app.use("/api/leaks", leakRoutes);
app.use("/api/detect", detectionRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Subscription Leak Detector API is running.",
  });
});

module.exports = app;