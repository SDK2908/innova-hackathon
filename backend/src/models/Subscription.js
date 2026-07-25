const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    merchantName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    cycleType: {
      type: String,
      enum: ["weekly", "monthly", "quarterly", "annual", "irregular"],
      required: true,
    },

    cycleDays: {
      type: Number,
      required: true,
    },

    transactionIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],

    currentAmount: {
      type: Number,
      required: true,
    },

    previousAmount: {
      type: Number,
      default: null,
    },

    priceHikePercent: {
      type: Number,
      default: 0,
    },

    isTrialTrap: {
      type: Boolean,
      default: false,
    },

    isUnused: {
      type: Boolean,
      default: false,
    },

    lastChargeDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["active", "cancelled", "downgraded"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);