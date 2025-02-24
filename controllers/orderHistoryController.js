const Order = require("../models/order");
const OrderHistory = require("../models/orderHistory");

// Move an order to history and delete from active orders
exports.moveToHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a new history record
    const orderHistory = new OrderHistory({ ...order.toObject() });
    await orderHistory.save();

    // Delete the order from active orders
    await Order.findByIdAndDelete(orderId);

    res.status(200).json({ message: "Order moved to history" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get all past orders
exports.getOrderHistory = async (req, res) => {
  try {
    const history = await OrderHistory.find().populate("items.menuItemId");
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Get a specific past order by ID
exports.getOrderHistoryById = async (req, res) => {
  try {
    const { orderHistoryId } = req.params;
    console.log(orderHistoryId);
    const historyOrder = await OrderHistory.findById(orderHistoryId).populate(
      "items.menuItemId"
    );

    if (!historyOrder) {
      return res.status(404).json({ message: "Order not found in history" });
    }

    res.status(200).json(historyOrder);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Restore an order from history to active orders
exports.restoreOrder = async (req, res) => {
  try {
    const { orderHistoryId } = req.params;
    const historyOrder = await OrderHistory.findById(orderHistoryId);

    if (!historyOrder) {
      return res.status(404).json({ message: "Order not found in history" });
    }

    // Create a new order from the history data
    const restoredOrder = new Order({ ...historyOrder.toObject() });
    await restoredOrder.save();

    // Delete from history
    await OrderHistory.findByIdAndDelete(orderHistoryId);

    res.status(200).json({ message: "Order restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
