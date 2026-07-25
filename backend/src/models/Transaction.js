const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rawMerchant: {
      type: String,
      required: true,
    },

    normalizedMerchant: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    date: {
      type: Date,
      required: true,
    },

    category: {
  type: String,
  default: "Unknown",
},

    source: {
      type: String,
      enum: ["csv", "email", "sms"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);