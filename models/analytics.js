const mongoose = require("mongoose");

const AnalyticsSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  eventType: { type: String, required: true },
  eventData: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", AnalyticsSchema);
