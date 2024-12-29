// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const customersRouter = require("./routes/customers");
const menuItemsRouter = require("./routes/menuItems");
const ordersRouter = require("./routes/orders");
const tablesRouter = require("./routes/tables");
const usersRouter = require("./routes/users");
const path = require("path"); // Import path module to handle file paths

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'uploads' folder
app.use("/localStorage", express.static(path.join(__dirname, "localStorage")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/customers", customersRouter);
app.use("/api/menuItems", menuItemsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/tables", tablesRouter);
app.use("/api/users", usersRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Export the app for serverless deployment on Vercel
module.exports = app;
