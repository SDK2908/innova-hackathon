const Subscription = require("../models/Subscription");
const LeakScore = require("../models/LeakScore");

const getAllLeaks = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const subscriptions = await Subscription.find({ userId });
    const leakScore = await LeakScore.findOne({ userId });

    return res.status(200).json({
      success: true,
      leakScore,
      subscriptions,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch leaks",
    });
  }
};

const getLeakById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      success: true,
      subscription,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch subscription",
    });
  }
};

const performLeakAction = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Action recorded successfully.",
    action: req.body.type,
  });
};

module.exports = {
  getAllLeaks,
  getLeakById,
  performLeakAction,
};