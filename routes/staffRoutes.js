const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// Create a new staff member
router.post("/staff", staffController.createStaff);

// Get all staff members
router.get("/staff", staffController.getAllStaff);

// Get a specific staff member by ID
router.get("/staff/:id", staffController.getStaffById);

// Update staff details
router.put("/staff/:id", staffController.updateStaff);

// Delete a staff member
router.delete("/staff/:id", staffController.deleteStaff);

module.exports = router;
