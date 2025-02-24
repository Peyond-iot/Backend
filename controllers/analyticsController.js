const Analytics = require("../models/analytics");

// Get sales analytics (e.g., total sales, orders count, etc.)
exports.getSalesAnalytics = async (req, res) => {
  try {
    const analytics = await Analytics.find();
    res.status(200).json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular menu items based on order frequency
exports.getPopularItems = async (req, res) => {
  try {
    const popularItems = await Analytics.aggregate([
      { $group: { _id: "$menuItemId", totalOrders: { $sum: 1 } } },
      { $sort: { totalOrders: -1 } },
    ]);
    res.status(200).json(popularItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get revenue statistics for a given period (daily, monthly, yearly)
exports.getRevenueStats = async (req, res) => {
  try {
    const revenueStats = await Analytics.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(req.params.startDate),
            $lte: new Date(req.params.endDate),
          },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } },
    ]);
    res.status(200).json(revenueStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
