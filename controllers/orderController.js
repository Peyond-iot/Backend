const Order = require("../models/order");
const MenuItem = require("../models/menuItem"); // Import MenuItem for price validation
const mongoose = require("mongoose");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, customerId, tableId, items, discount, notes } =
      req.body;

    if (!restaurantId || !tableId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Calculate total price of the order
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res
          .status(400)
          .json({ message: `Menu item not found: ${item.menuItemId}` });
      }

      // Calculate total for this item
      item.price = menuItem.price; // Ensure the price is the latest price from MenuItem
      item.total = item.quantity * item.price;
      totalPrice += item.total;
    }

    // Apply discount if any
    totalPrice -= discount || 0;

    const newOrder = new Order({
      restaurantId,
      customerId: customerId || null, // Can be null for staff orders
      tableId,
      items,
      totalPrice,
      discount,
      notes,
    });

    await newOrder.save();
    return res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ message: "Server error while creating order." });
  }
};

// Get all orders (can filter by restaurantId if needed)
exports.getOrders = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // Assuming the restaurantId is available in the user object
    console.log(restaurantId);
    const orders = await Order.find({ restaurantId })
      .populate("items.menuItemId")
      .sort({ orderTime: -1 });
    console.log(orders);
    return res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching orders." });
  }
};

// Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("items.menuItemId");

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching order." });
  }
};

// Update Order Status (e.g., prepared, delivered)
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Ensure status is valid
    const validStatuses = [
      "pending",
      "in-progress",
      "prepared",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Update status and the appropriate timestamp
    order.status = status;
    if (status === "prepared") {
      order.preparedTime = new Date();
    } else if (status === "delivered") {
      order.deliveredTime = new Date();
    }

    await order.save();
    return res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(500)
      .json({ message: "Server error while updating order status." });
  }
};
