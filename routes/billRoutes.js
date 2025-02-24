const express = require("express");
const router = express.Router();
const billController = require("../controllers/billController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// ✅ Generate Bill (Only Staff/Admin)
router.post(
  "/create",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  billController.createBill
);

// ✅ Get Bill by ID (Only Staff/Admin)
router.get(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  billController.getBillById
);

// ✅ Update Bill Payment (Only Staff/Admin)
router.put(
  "/:id/payment",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  billController.updateBillPayment
);

// ✅ Get All Bills (Only Admin)
router.get(
  "/",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  billController.getAllBills
);

module.exports = router;
