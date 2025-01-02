const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
    required: true,
  }, // Reference to the table
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  }, // Reference to the customer
  orderItems: [
    {
      name: { type: String, required: true }, // Item name (e.g., Burger, Fries)
      quantity: { type: Number, required: true }, // Quantity of the item ordered
      spiceLevel: { type: String }, // Spice level for the item (e.g., Mild, Medium, Hot)
      notes: { type: String }, // Special instructions for the item (e.g., no onions)
    },
  ],
  tableNumber: { type: String, required: true }, // Table number where the order was placed
  totalPrice: { type: Number, required: true }, // Total price of the order
  status: {
    type: String,
    enum: ["pending", "in-preparation", "completed", "served"],
    default: "pending",
  }, // Track the order progress
  notes: { type: String }, // Notes related to the order (e.g., customer preferences)
  placedAt: { type: Date, default: Date.now }, // Timestamp when the order was placed
  completedAt: { type: Date }, // Timestamp when the order was completed
});

module.exports = mongoose.model("Order", orderSchema);
