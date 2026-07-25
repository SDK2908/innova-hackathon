const fs = require("fs");
const csv = require("csv-parser");

const Transaction = require("../models/Transaction");
const Subscription = require("../models/Subscription");
const LeakScore = require("../models/LeakScore");

const {
  normalizeMerchant,
} = require("../services/merchantNormalizationService");

const {
  groupTransactions,
  buildSubscriptions,
} = require("../services/detectionService");

const {
  calculateLeakScore,
} = require("../services/leakScoreService");

const uploadTransactions = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No CSV file uploaded.",
      });
    }

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    const transactions = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        const merchant =
          row.rawMerchant ||
          row.merchant ||
          row.description ||
          row.payee ||
          "Unknown";

        const amount = parseFloat(
          String(row.amount || "").replace(/[^0-9.-]/g, "")
        );

        if (isNaN(amount)) return;

        transactions.push({
          userId,
          rawMerchant: merchant,
          normalizedMerchant: normalizeMerchant(merchant),
          amount,
          currency: row.currency || "USD",
          date: new Date(row.date),
          category: row.category || "Unknown",
          source: row.source || "csv",
        });
      })
      .on("end", async () => {
        try {
          // Delete previous data for this user
          await Transaction.deleteMany({ userId });
          await Subscription.deleteMany({ userId });
          await LeakScore.deleteMany({ userId });

          // Save uploaded transactions
          const savedTransactions = await Transaction.insertMany(
            transactions
          );

          // Group transactions
          const grouped = groupTransactions(savedTransactions);

          // Build subscriptions
          const subscriptions = await buildSubscriptions(
            userId,
            grouped
          );

          // Calculate leak score
          const leakScore = await calculateLeakScore(
            userId,
            subscriptions
          );

          // Delete uploaded CSV
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(201).json({
            success: true,
            message: "Transactions uploaded successfully.",
            transactionsIngested: savedTransactions.length,
            subscriptionsCreated: subscriptions.length,
            leakScore: leakScore.score,
            userId,
          });
        } catch (err) {
          console.error(err);

          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            success: false,
            message: "Failed to process transactions.",
            error: err.message,
          });
        }
      });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadTransactions,
};