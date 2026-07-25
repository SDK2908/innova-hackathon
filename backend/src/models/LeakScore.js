const mongoose = require("mongoose");

const leakScoreSchema = new mongoose.Schema(
  {
userId: {
  type: String,
  required: true,
},

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    monthlyWasteEstimate: {
      type: Number,
      default: 0,
    },

    yearlyWasteEstimate: {
      type: Number,
      default: 0,
    },

    reasons: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LeakScore", leakScoreSchema);