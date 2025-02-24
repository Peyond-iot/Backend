const express = require("express");
const router = express.Router();
const orderHistoryController = require("../controllers/orderHistoryController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Route to move an order to history (Only restaurant_admin and staff can do this)
router.post(
  "/move-to-history/:orderId",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  orderHistoryController.moveToHistory
);

// Route to get all order history (Only restaurant_admin and staff can view history)
router.get(
  "/",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  orderHistoryController.getOrderHistory
);

// Route to get a specific order history by ID (Only restaurant_admin and staff can access)
router.get(
  "/:orderHistoryId",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  orderHistoryController.getOrderHistoryById
);

// Route to restore an order from history back to active orders (Only restaurant_admin can do this)
router.post(
  "/restore/:orderHistoryId",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  orderHistoryController.restoreOrder
);

module.exports = router;
