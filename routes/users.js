const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/", userController.getAllUsers);

// Create a new user
router.post("/", userController.createUser);

// Get a user by ID
router.get("/:id", userController.getUserById);

// Update a user by ID (e.g., change role)
router.put("/:id", userController.updateUser);

// Delete a user by ID
router.delete("/:id", userController.deleteUser);

module.exports = router;
