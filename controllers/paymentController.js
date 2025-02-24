const Payment = require("../models/payment");
const Bill = require("../models/bill");

// Create Payment
exports.createPayment = async (req, res) => {
  try {
    const { billId, amountPaid, paymentMethod, transactionId } = req.body;

    // Check if all required fields are provided
    if (!billId || !amountPaid || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the bill and check if the total amount is covered
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // Check if the amount paid is greater than or equal to the total amount of the bill
    if (amountPaid < bill.totalAmount) {
      return res
        .status(400)
        .json({ message: "Amount paid is less than the total bill" });
    }

    // Create the payment
    const payment = new Payment({
      billId,
      amountPaid,
      paymentMethod,
      transactionId,
      paymentStatus: amountPaid >= bill.totalAmount ? "completed" : "pending",
    });

    // Save the payment to the database
    await payment.save();

    // Update the bill status to "paid" if the amount paid is equal to or greater than the total
    if (amountPaid >= bill.totalAmount) {
      bill.paymentStatus = "paid";
      await bill.save();
    }

    res.status(201).json({
      message: "Payment recorded successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Payments for a Specific Bill
exports.getPaymentsByBill = async (req, res) => {
  try {
    const { billId } = req.params;

    // Find payments linked to the bill
    const payments = await Payment.find({ billId }).populate(
      "billId",
      "totalAmount"
    );

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "No payments found for this bill" });
    }

    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel Payment (optional)
// Cancel Payment (optional)
exports.cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Find the payment and delete it
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update the corresponding bill's payment status if needed
    const bill = await Bill.findById(payment.billId);
    if (bill && bill.paymentStatus === "paid") {
      bill.paymentStatus = "pending"; // Revert to pending status
      await bill.save();
    }

    // Delete the payment record
    await Payment.findByIdAndDelete(paymentId);

    res.status(200).json({
      message: "Payment canceled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
