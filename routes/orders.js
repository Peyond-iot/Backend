const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get all orders
router.get("/", orderController.getAllOrders);

// Create a new order
router.post("/", orderController.createOrder);

// Get an order by ID
router.get("/:id", orderController.getOrderById);

// Update an order by ID (e.g., mark as completed)
router.put("/:id", orderController.updateOrder);

// Delete an order by ID
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
