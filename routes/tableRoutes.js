const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const {
  authenticateToken,
  checkRole,
} = require("../middlewares/authMiddleware");

// Apply middleware at the route level
router.post(
  "/create",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  tableController.createTable
);
router.get(
  "/",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  tableController.getTables
);
router.get(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin", "staff"]),
  tableController.getTableById
);
router.put(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  tableController.updateTable
);
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["restaurant_admin"]),
  tableController.deleteTable
);

module.exports = router;
