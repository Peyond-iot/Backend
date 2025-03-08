const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const menuItemController = require("../controllers/menuItemController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// 🔹 Create a new menu item (Only restaurant_admin)
router.post(
  "/",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "altImage", maxCount: 1 },
    { name: "imageSlider", maxCount: 5 },
  ]),
  menuItemController.createMenuItem
);

// 🔹 Get all menu items for the logged-in restaurant
router.get("/", authenticateToken, menuItemController.getMenuItems);

// 🔹 Get a specific menu item by ID (Ensures it belongs to the restaurant)
router.get("/:id", authenticateToken, menuItemController.getMenuItemById);

// 🔹 Update a menu item (Only restaurant_admin)
router.put(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  menuItemController.updateMenuItem
);

// 🔹 Delete a menu item (Only restaurant_admin)
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  menuItemController.deleteMenuItem
);

module.exports = router;
