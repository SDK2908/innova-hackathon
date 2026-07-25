const Subscription = require("../models/Subscription");
const buildPrompt = require("../utils/promptBuilder");
const { runLyzrAgent } = require("../services/lyzrService");

// ======================================
// Analyze Portfolio (Single AI Agent)
// ======================================

exports.analyzePortfolio = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    const subscriptions = await Subscription.find({
      userId,
      status: "active",
    }).sort({ merchantName: 1 });

    if (!subscriptions.length) {
      return res.status(404).json({
        success: false,
        message: "No active subscriptions found.",
      });
    }

    // Build one prompt
    const prompt = buildPrompt(subscriptions);

    // One AI call
    const response = await runLyzrAgent(userId, prompt);

    // Lyzr may return JSON directly or as a string
    let report = response.response || response.message || response;

    if (typeof report === "string") {
      try {
        report = JSON.parse(report);
      } catch (e) {
        // Keep the original string if parsing fails
      }
    }

    return res.json({
      success: true,
      subscriptionsAnalyzed: subscriptions.length,
      report,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};