const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Reference to the restaurant
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Reference to the customer who placed the order (can be null for staff orders)
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
    },

    // Table number or ID associated with the order
    tableId: {
      type: String,
      required: true,
    },

    // List of menu items ordered
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],

    // Order status (e.g., pending, prepared, delivered)
    status: {
      type: String,
      enum: ["pending", "in-progress", "prepared", "delivered", "cancelled"],
      default: "pending",
    },

    // Time when the order was placed
    orderTime: {
      type: Date,
      default: Date.now,
    },

    // Time when the order was marked as prepared
    preparedTime: {
      type: Date,
      required: false,
    },

    // Time when the order was delivered
    deliveredTime: {
      type: Date,
      required: false,
    },

    // Total price of the order
    totalPrice: {
      type: Number,
      required: true,
    },

    // Payment status (e.g., pending, paid)
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    // Discount applied to the order (if any)
    discount: {
      type: Number,
      default: 0,
    },

    // Special notes or instructions for the order
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Order model export
//module.exports = mongoose.model("Order", OrderSchema);

// ✅ Fix: Prevent model overwrite error
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

module.exports = Order;
