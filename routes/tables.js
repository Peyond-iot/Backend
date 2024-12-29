const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");

// Get all tables
router.get("/", tableController.getAllTables);

// Create a new table
router.post("/", tableController.createTable);

// Get a table by ID
router.get("/:id", tableController.getTableById);

// Update a table by ID (e.g., mark as occupied)
router.put("/:id", tableController.updateTable);

// Delete a table by ID
router.delete("/:id", tableController.deleteTable);

module.exports = router;
