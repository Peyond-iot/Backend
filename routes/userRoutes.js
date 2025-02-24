const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Register a new user (saas_admin or restaurant_admin can register users)
router.post(
  "/register",
  authenticateToken,
  checkRole(["saas_admin", "restaurant_admin"]),
  userController.registerUser
);

// Login a user
router.post("/login", userController.loginUser);

// Get all users for a restaurant by restaurant_admin and saas_admin
router.get(
  "/",
  authenticateToken,
  checkRole(["saas_admin", "restaurant_admin"]),
  userController.getAllUsers
);

// Get a user by ID (admin only)
router.get(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin", "restaurant_admin"]),
  userController.getUserById
);

// Update user (only admins can update)
router.put(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin", "restaurant_admin"]),
  userController.updateUser
);

// Delete user (only admins can delete)
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin", "restaurant_admin"]),
  userController.deleteUser
);

module.exports = router;
