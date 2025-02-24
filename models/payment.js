const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill", required: true },
  amountPaid: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit card", "debit card", "UPI"],
    required: true,
  },
  transactionId: { type: String }, // For online payments
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentDate: { type: Date, default: Date.now },
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
