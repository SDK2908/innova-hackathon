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
        try {
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

          const transactionDate = new Date(row.date);

          if (isNaN(transactionDate.getTime())) {
            console.warn("Skipping row with invalid date:", row);
            return;
          }

          transactions.push({
            userId,
            rawMerchant: merchant,
            normalizedMerchant: normalizeMerchant(merchant),
            amount,
            currency: row.currency || "USD",
            date: transactionDate,
            category: row.category || "Unknown",
            source: row.source || "csv",
          });
        } catch (err) {
          console.error("Error parsing CSV row:", err);
        }
      })

      .on("end", async () => {
        try {
          console.log("========== CSV PARSED ==========");
          console.log("Transactions Found:", transactions.length);

          if (transactions.length === 0) {
            throw new Error(
              "No valid transactions found in uploaded CSV."
            );
          }

          console.log("Deleting old records...");

          await Transaction.deleteMany({ userId });
          await Subscription.deleteMany({ userId });
          await LeakScore.deleteMany({ userId });

          console.log("Saving transactions...");

          const savedTransactions = await Transaction.insertMany(
            transactions
          );

          console.log(
            "Transactions Saved:",
            savedTransactions.length
          );

          console.log("Grouping transactions...");

          const grouped = groupTransactions(savedTransactions);

          console.log("Building subscriptions...");

          const subscriptions = await buildSubscriptions(
            userId,
            grouped
          );

          console.log(
            "Subscriptions Created:",
            subscriptions.length
          );

          console.log("Calculating leak score...");

          const leakScore = await calculateLeakScore(
            userId,
            subscriptions
          );

          console.log("Leak Score Generated");
          console.log("==============================");

          if (req.file && fs.existsSync(req.file.path)) {
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
          console.error("========== PROCESS ERROR ==========");
          console.error(err);
          console.error(err.stack);
          console.error("===================================");

          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }

          return res.status(500).json({
            success: false,
            message: "Failed to process transactions.",
            error: err.message,
          });
        }
      })

      .on("error", (err) => {
        console.error("CSV Read Error:", err);

        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(500).json({
          success: false,
          message: "Error reading CSV file.",
          error: err.message,
        });
      });

  } catch (err) {
    console.error("========== SERVER ERROR ==========");
    console.error(err);
    console.error(err.stack);
    console.error("==================================");

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  uploadTransactions,
};