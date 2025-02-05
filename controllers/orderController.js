// backend/controllers/orderController.js
const Order = require("../models/order");
const { getSocketInstance } = require("../socket");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  const order = new Order({
    tableId: req.body.tableId,
    customerId: req.body.customerId,
    tableNumber: req.body.tableNumber,
    totalPrice: req.body.totalPrice,
    orderItems: req.body.orderItems,
    ticketStatus: req.body.ticketStatus,
    placedAt: req.body.placedAt || Date.now(),
    completedAt: req.body.completedAt,
    restaurantName: req.body.restaurantName,
    updatedAt: req.body.updatedAt,
    currency: req.body.currency,
    orderNO: req.body.orderNO,
  });

  try {
    const newOrder = await order.save();
    console.log("New order created:", newOrder);

    // Emit the new order to connected clients
    const io = getSocketInstance();
    io.emit("newOrderCreated", newOrder);

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get an order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedOrder)
      return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Generalized update for a specific order item within an order
// Update order item status
exports.updateOrderItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ["pending", "in-preparation", "completed", "served"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Find and update the specific order item
    const order = await Order.findOneAndUpdate(
      {
        _id: orderId,
        "orderItems._id": itemId,
      },
      {
        $set: {
          "orderItems.$.status": status,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order or item not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order item status:", error);
    res.status(500).json({ error: "Failed to update order item status" });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
