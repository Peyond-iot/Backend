const Restaurant = require("../models/restaurant");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");

// Middleware to check if the user is authenticated
exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }
    req.user = user; // Attach user info to request object
    next();
  });
};

// Middleware to check if the user has a specific role
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

// ✅ New Middleware to Restrict Restaurant Admins to Their Own Restaurant
exports.checkRestaurantAccess = async (req, res, next) => {
  try {
    const user = req.user; // Extract user details from token
    const restaurantId = req.params.restaurantId || req.body.restaurantId;

    // If the user is a restaurant admin, ensure they belong to this restaurant
    if (user.role === "restaurant_admin") {
      if (!restaurantId) {
        return res.status(400).json({ message: "Restaurant ID is required." });
      }

      // Fetch the restaurant from the database
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant || restaurant.admin.toString() !== user.id) {
        return res.status(403).json({ message: "Access denied. You do not manage this restaurant." });
      }
    }

    next(); // Proceed if validation passes
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
