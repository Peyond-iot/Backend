// routes/printRoutes.js
const express = require("express");
const { printOrder } = require("../controllers/printController");

const router = express.Router();

// POST route to handle print requests
router.post("/", async (req, res) => {
  const { orderDetails } = req.body; // Get order details from the request body

  try {
    const result = await printOrder(orderDetails); // Call the print controller function
    res.json({ success: true, message: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

module.exports = router;
