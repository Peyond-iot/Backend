const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Route to create an order
router.post(
  "/create",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Check if the user is admin or staff
  orderController.createOrder
);

// Route to get all orders
router.get(
  "/",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Check if the user is admin or staff
  orderController.getOrders
);

// Route to get a specific order by ID
router.get(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Check if the user is admin or staff
  orderController.getOrderById
);

// Route to update the order status
router.patch(
  "/:id/status",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]), // Check if the user is admin or staff
  orderController.updateOrderStatus
);

module.exports = router;
