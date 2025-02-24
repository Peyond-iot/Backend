const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Create a new restaurant
router.post(
  "/",
  authenticateToken,
  checkRole(["saas_admin"]),
  restaurantController.createRestaurant
);

// Get all restaurants
router.get(
  "/",
  authenticateToken,
  checkRole(["saas_admin"]),
  restaurantController.getRestaurants
);

// Get restaurant by ID
router.get(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin"]),
  restaurantController.getRestaurantById
);

// Update restaurant by ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin"]),
  restaurantController.updateRestaurant
);

// Delete restaurant by ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["saas_admin"]),
  restaurantController.deleteRestaurant
);

module.exports = router;
