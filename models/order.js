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
  tableNumber: { type: String, required: true }, // Table number where the order was placed
  totalPrice: { type: Number, required: true }, // Total price of the order
  placedAt: { type: Date, default: Date.now }, // Timestamp when the order was placed
  completedAt: { type: Date }, // Timestamp when the order was completed
  restaurantName: { type: String },
  updatedAt: { type: Date },
  currency: { type: String }, // sign of money
  orderNO: { type: Number },
  ticketStatus: {
    type: String,
    enum: ["pending", "in-preparation", "completed", "served"],
    default: "pending",
  }, // Track the Ticket progress
  orderItems: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      }, // Reference to the table
      name: { type: String, required: true }, // Item name (e.g., Burger, Fries)
      quantity: { type: Number, required: true }, // Quantity of the item ordered
      spiceLevel: { type: String }, // Spice level for the item (e.g., Mild, Medium, Hot)
      notes: { type: String }, // Special instructions for the item (e.g., no onions)
      status: {
        type: String,
        enum: ["pending", "in-preparation", "completed", "served"],
        default: "pending",
      }, // Track the order progress
      catergory: { type: String }, // category of food
      price: { type: Number }, //Price of one item
      food_type: { type: String }, //vegornonveg
      notes: { type: String }, // Notes related to the order (e.g., customer preferences)
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
