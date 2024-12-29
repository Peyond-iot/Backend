const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Get all customers
router.get("/", customerController.getAllCustomers);

// Create a new customer
router.post("/", customerController.createCustomer);

// Get a customer by ID
router.get("/:id", customerController.getCustomerById);

// Update a customer by ID
router.put("/:id", customerController.updateCustomer);

// Delete a customer by ID
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
