const Transaction = require("../models/Transaction");
const Subscription = require("../models/Subscription");
const LeakScore = require("../models/LeakScore");

const {
  groupTransactions,
  buildSubscriptions,
} = require("../services/detectionService");

const {
  calculateLeakScore,
} = require("../services/leakScoreService");

const detectSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId });

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "No transactions found.",
      });
    }

    // Delete previous analysis
    await Subscription.deleteMany({ userId });
    await LeakScore.deleteMany({ userId });

    const grouped = groupTransactions(transactions);

    const subscriptions = await buildSubscriptions(
      userId,
      grouped
    );

    const leakScore = await calculateLeakScore(
      userId,
      subscriptions
    );

    return res.status(200).json({
      success: true,
      subscriptions,
      leakScore,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Detection failed.",
    });
  }
};

module.exports = {
  detectSubscriptions,
};