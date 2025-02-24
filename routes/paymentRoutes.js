const express = require("express");
const router = express.Router();
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");
const {
  createPayment,
  getPaymentsByBill,
  cancelPayment,
} = require("../controllers/paymentController");

// Route to create a payment (accessible by users with 'admin' or 'cashier' roles)
router.post(
  "/create",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Only admin and cashier can create payments
  createPayment
);

// Route to get payments by Bill ID (accessible by users with 'admin' or 'manager' roles)
router.get(
  "/bill/:billId",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Only admin and manager can view payments
  getPaymentsByBill
);

// Route to cancel a payment (accessible by users with 'admin' or 'cashier' roles)
router.delete(
  "/cancel/:paymentId",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Only admin and cashier can cancel payments
  cancelPayment
);

module.exports = router;
