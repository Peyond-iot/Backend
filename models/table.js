const mongoose = require("mongoose");

const TableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true }, // Unique Table Number
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  }, // Link to Restaurant
  currentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  }, // Ongoing order (if any)
  status: {
    type: String,
    enum: ["available", "occupied", "reserved"],
    default: "available",
  }, // Table status
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Table", TableSchema);
