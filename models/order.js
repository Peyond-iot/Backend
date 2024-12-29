const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  }, // Reference to the table
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, // Reference to the customer
  items: [
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },
      quantity: { type: Number, required: true },
      notes: { type: String }, // Special instructions for the item
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "in-preparation", "completed", "served"],
    default: "pending",
  }, // Track the order progress
  placedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
});

module.exports = mongoose.model("Order", orderSchema);
