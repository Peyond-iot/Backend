const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Import routes
// const analyticsRoutes = require("./routes/analyticsRoutes");
const billRoutes = require("./routes/billRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const orderHistoryRoutes = require("./routes/orderHistoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
// const staffRoutes = require("./routes/staffRoutes");
const tableRoutes = require("./routes/tableRoutes");
const userRoutes = require("./routes/userRoutes");

const { initSocket } = require("./socket"); // Import the initSocket function

const app = express();
const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
initSocket(server);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Routes
// app.use("/api/analytics",analyticsRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/menu-items", menuItemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/restaurants", restaurantRoutes);
// app.use("/api/staff", staffRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
