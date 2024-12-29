const express = require("express");
const router = express.Router();
const menuItemController = require("../controllers/menuItemController");
const upload = menuItemController.upload; // Import the upload middleware correctly

// Get all menu items
router.get("/", menuItemController.getAllMenuItems);

// Create a new menu item with image upload
router.post("/", upload.single("image"), menuItemController.createMenuItem);

// Get a menu item by ID
router.get("/:id", menuItemController.getMenuItemById);

// Update a menu item by ID (with image upload)
router.put("/:id", upload.single("image"), menuItemController.updateMenuItem);

// Delete a menu item by ID
router.delete("/:id", menuItemController.deleteMenuItem);

module.exports = router;
