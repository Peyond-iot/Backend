const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/user"); // Your User model
require("dotenv").config();

async function createSaaSAdmin() {
  await mongoose.connect(
    "mongodb+srv://ankit2003:ankit2003@cluster0.4r6nrnv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  // MongoDB connection

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    name: "Super Admin",
    email: "admin@example.com",
    password: hashedPassword,
    restaurantId: "67b1707915931e802f9593e8",
    role: "saas_admin",
  });

  await admin.save();
  console.log("SaaS Admin created!");
}

createSaaSAdmin();
