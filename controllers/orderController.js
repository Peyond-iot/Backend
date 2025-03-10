const Table = require("../models/table");
const MenuItem = require("../models/menuItem");
const Order = require("../models/order");
const mongoose = require("mongoose");

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { customerId, tableId, items, discount, notes } = req.body;
    const restaurantId = req.user.restaurantId; // Ensure the user is associated with a restaurant

    if (!tableId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // ✅ Step 1: Validate that the table belongs to the restaurant
    const table = await Table.findOne({ _id: tableId, restaurantId });
    if (!table) {
      return res
        .status(400)
        .json({ message: "Invalid table for this restaurant." });
    }

    // ✅ Step 2: Validate all menu items belong to the restaurant
    const menuItemIds = items.map((item) => item.menuItemId);
    const validMenuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      restaurantId,
    });

    if (validMenuItems.length !== items.length) {
      return res.status(400).json({
        message: "One or more menu items do not belong to this restaurant.",
      });
    }

    // ✅ Step 3: Calculate total price of the order
    let totalPrice = 0;
    const updatedItems = items.map((item) => {
      const menuItem = validMenuItems.find(
        (menu) => menu._id.toString() === item.menuItemId
      );
      if (!menuItem) {
        throw new Error(`Invalid menu item: ${item.menuItemId}`);
      }
      const price = menuItem.price; // Ensure price comes from the database
      const total = item.quantity * price;
      totalPrice += total;
      return { ...item, price, total };
    });

    // ✅ Step 4: Apply discount if any
    totalPrice -= discount || 0;

    // ✅ Step 5: Create the order
    const newOrder = new Order({
      restaurantId,
      customerId: customerId || null, // Can be null for staff orders
      tableId,
      items: updatedItems,
      totalPrice,
      discount,
      notes,
    });

    await newOrder.save();

    // ✅ Step 6: Update table status to 'occupied' and assign current order ID
    table.status = "occupied"; // Change table status to 'occupied'
    table.currentOrderId = newOrder._id; // Link the order to the table
    await table.save(); // Save updated table

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

// Get Orders by Table ID
// Get orders for a specific table (filtered by tableId and restaurantId)
exports.getOrdersByTableId = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId; // Get restaurantId from the user object
    const { tableId } = req.params; // Get tableId from the route params
    console.log(
      `Fetching orders for Table ID: ${tableId}, Restaurant ID: ${restaurantId}`
    );

    // Check if the tableId is valid
    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({ message: "Invalid Table ID" });
    }

    // Find orders for the specific tableId and restaurantId
    const orders = await Order.find({ tableId, restaurantId })
      .populate("items.menuItemId") // Populate the menu items
      .sort({ orderTime: -1 }); // Sort by order time, descending (latest orders first)

    if (!orders.length) {
      return res
        .status(404)
        .json({ message: "No orders found for this table" });
    }

    console.log(orders); // Log the orders for debugging
    return res.json(orders); // Send the found orders as response
  } catch (error) {
    console.error("Error fetching orders by tableId:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching orders." });
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
