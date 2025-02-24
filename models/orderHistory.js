const mongoose = require("mongoose");

const OrderHistorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },
    tableId: {
      type: String,
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        // name: { type: String, required: true }, // Store item name for reference
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        total: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["delivered", "cancelled"],
      required: true,
    },
    orderTime: { type: Date, required: true },
    preparedTime: { type: Date },
    deliveredTime: { type: Date },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OrderHistory", OrderHistorySchema);
