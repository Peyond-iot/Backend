const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const customersRouter = require("./routes/customers");
const menuItemsRouter = require("./routes/menuItems");
const ordersRouter = require("./routes/orders");
const tablesRouter = require("./routes/tables");
const usersRouter = require("./routes/users");

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
app.use("/api/customers", customersRouter);
app.use("/api/menuItems", menuItemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/tables", tablesRouter);
app.use("/api/users", usersRouter);

// Root route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Listen on the specified port
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
