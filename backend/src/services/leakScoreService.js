const LeakScore = require("../models/LeakScore");

const calculateLeakScore = async (userId, subscriptions) => {
  let score = 0;

  const reasons = [];

  let monthlyWaste = 0;

  subscriptions.forEach((sub) => {
    // Trial trap
    if (sub.isTrialTrap) {
      score += 30;
      reasons.push(`${sub.merchantName} is a trial trap`);
    }

    // Price hike
    if (sub.priceHikePercent > 10) {
      score += 20;
      reasons.push(
        `${sub.merchantName} increased by ${sub.priceHikePercent}%`
      );
    }

    // Unused
    if (sub.isUnused) {
      score += 25;
      monthlyWaste += sub.currentAmount;
      reasons.push(`${sub.merchantName} appears unused`);
    }

    // Expensive subscription
    if (sub.currentAmount > 30) {
      score += 10;
    }
  });

  score = Math.min(score, 100);

  const leakScore = await LeakScore.create({
    userId,
    score,
    monthlyWasteEstimate: monthlyWaste,
    yearlyWasteEstimate: monthlyWaste * 12,
    reasons,
  });

  return leakScore;
};

module.exports = {
  calculateLeakScore,
};