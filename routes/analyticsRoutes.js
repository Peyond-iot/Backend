const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

// Create analytics data
router.post("/analytics", analyticsController.createAnalytics);

// Get all analytics data
router.get("/analytics", analyticsController.getAllAnalytics);

// Get analytics data by ID
router.get("/analytics/:id", analyticsController.getAnalyticsById);

// Update analytics data
router.put("/analytics/:id", analyticsController.updateAnalytics);

// Delete analytics data
router.delete("/analytics/:id", analyticsController.deleteAnalytics);

module.exports = router;
