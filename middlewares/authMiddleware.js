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
