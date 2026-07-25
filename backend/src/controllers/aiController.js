const Subscription = require("../models/Subscription");
const buildPrompt = require("../utils/promptBuilder");
const { runLyzrAgent } = require("../services/lyzrService");

const validAgents = [
  "forensics",
  "recovery",
  "intelligence",
  "simulator",
  "resolution",
  "executive",
];

exports.runAgent = async (req, res) => {
  try {
    const { agent, userId } = req.body;

    if (!agent || !userId) {
      return res.status(400).json({
        success: false,
        message: "agent and userId are required.",
      });
    }

    if (!validAgents.includes(agent)) {
      return res.status(400).json({
        success: false,
        message: "Invalid agent.",
      });
    }

    // Fetch subscriptions for the user
    const subscriptions = await Subscription.find({
      userId,
      status: "active",
    }).sort({ merchantName: 1 });

    // Build prompt from database data
    const prompt = buildPrompt(agent, subscriptions);

    // Call Lyzr
    const result = await runLyzrAgent(agent, userId, prompt);

    return res.json({
      success: true,
      subscriptionsAnalyzed: subscriptions.length,
      result,
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};