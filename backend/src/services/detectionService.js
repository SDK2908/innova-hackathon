const Subscription = require("../models/Subscription");

const groupTransactions = (transactions) => {
  const grouped = {};

  transactions.forEach((transaction) => {
    const merchant =
      transaction.normalizedMerchant || transaction.rawMerchant;

    if (!grouped[merchant]) {
      grouped[merchant] = [];
    }

    grouped[merchant].push(transaction);
  });

  return grouped;
};

const calculateCycle = (transactions) => {
  if (transactions.length < 2) {
    return {
      cycleType: "irregular",
      cycleDays: 0,
    };
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let total = 0;

  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i].date) -
        new Date(sorted[i - 1].date)) /
      (1000 * 60 * 60 * 24);

    total += diff;
  }

  const avg = total / (sorted.length - 1);

  if (avg >= 27 && avg <= 33)
    return { cycleType: "monthly", cycleDays: 30 };

  if (avg >= 6 && avg <= 8)
    return { cycleType: "weekly", cycleDays: 7 };

  if (avg >= 88 && avg <= 92)
    return { cycleType: "quarterly", cycleDays: 90 };

  if (avg >= 360 && avg <= 370)
    return { cycleType: "annual", cycleDays: 365 };

  return {
    cycleType: "irregular",
    cycleDays: Math.round(avg),
  };
};

const detectPriceHike = (transactions) => {
  if (transactions.length < 2) {
    return {
      previousAmount: null,
      currentAmount: transactions[0]?.amount || 0,
      priceHikePercent: 0,
    };
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let biggestIncrease = 0;

  let previousAmount = sorted[0].amount;

  let currentAmount = sorted[sorted.length - 1].amount;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1].amount;
    const curr = sorted[i].amount;

    if (prev === 0) continue;

    const percent = ((curr - prev) / prev) * 100;

    if (percent > biggestIncrease) {
      biggestIncrease = percent;
      previousAmount = prev;
      currentAmount = curr;
    }
  }

  return {
    previousAmount,
    currentAmount,
    priceHikePercent:
      biggestIncrease > 5
        ? Number(biggestIncrease.toFixed(2))
        : 0,
  };
};

const detectTrialTrap = (transactions) => {
  if (transactions.length < 2) return false;

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const first = sorted[0];
  const second = sorted[1];

  const days =
    (new Date(second.date) -
      new Date(first.date)) /
    (1000 * 60 * 60 * 24);

  return (
    (first.amount === 0 || first.amount === 1) &&
    second.amount > first.amount &&
    days <= 30
  );
};

const buildSubscriptions = async (userId, groupedTransactions) => {
  const subscriptions = [];

  for (const merchant in groupedTransactions) {
    const txns = groupedTransactions[merchant];

    const cycle = calculateCycle(txns);

    const hike = detectPriceHike(txns);

    const trialTrap = detectTrialTrap(txns);

    const subscription = await Subscription.create({
      userId,
      merchantName: merchant,
      category: txns[0].category,
      cycleType: cycle.cycleType,
      cycleDays: cycle.cycleDays,
      transactionIds: txns.map((t) => t._id),
      currentAmount: hike.currentAmount,
      previousAmount: hike.previousAmount,
      priceHikePercent: hike.priceHikePercent,
      isTrialTrap: trialTrap,
      isUnused: false,
      lastChargeDate: txns[txns.length - 1].date,
    });

    subscriptions.push(subscription);
  }

  return subscriptions;
};

module.exports = {
  groupTransactions,
  calculateCycle,
  detectPriceHike,
  detectTrialTrap,
  buildSubscriptions,
};