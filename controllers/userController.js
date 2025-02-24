const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, restaurantId } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      restaurantId,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
      restaurantId: user.restaurantId, // Only add if the user is a `restaurant_admin`
    };
    console.log(payload.restaurantId);
    // Generate the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });

    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users for a restaurant :filter by restaurants(saas_admin only)
// Get all users for a restaurant: Filter by restaurant (saas_admin only)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role === "saas_admin") {
      // Fetch all users and populate their restaurant details
      const users = await User.find().populate("restaurantId", "name");

      // Group users by restaurantId
      const groupedUsers = users.reduce((acc, user) => {
        const restaurantId = user.restaurantId
          ? user.restaurantId._id.toString()
          : "no_restaurant";
        const restaurantName = user.restaurantId
          ? user.restaurantId.name
          : "No Restaurant";

        if (!acc[restaurantId]) {
          acc[restaurantId] = {
            restaurantId,
            restaurantName,
            users: [],
          };
        }

        acc[restaurantId].users.push({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        });

        return acc;
      }, {});

      return res.status(200).json(Object.values(groupedUsers));
    }

    // Restaurant Admin can view only their restaurant's users
    if (req.user.role === "restaurant_admin") {
      // Ensure req.user.restaurantId is populated correctly in the token
      if (!req.user.restaurantId) {
        return res
          .status(400)
          .json({ message: "Restaurant ID not found for user." });
      }
      const restaurant_users = await User.find({
        restaurantId: req.user.restaurantId,
      });
      return res.status(200).json(restaurant_users);
    }

    // If neither role matches, deny access
    return res.status(403).json({ message: "Access denied." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsersInRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "restaurant_admin") {
      return res.status(403).json({
        message:
          "Access denied. Only Restaurant Admin can view users in their restaurant.",
      });
    }

    const users = await User.find({ restaurantId: req.user.restaurantId }); // Fetch users of their restaurant
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user (saas_admin can update all users, restaurant_admin can only update restaurant staff)
// Update user (saas_admin can update all users, restaurant_admin can only update restaurant staff)
exports.updateUser = async (req, res) => {
  console.log("Update User");
  try {
    const userId = req.params.id;
    let updatedData = req.body;

    // Check if the logged-in user is a `restaurant_admin`
    if (req.user.role === "restaurant_admin") {
      console.log(req.user.role);
      // Only allow `restaurant_admin` to update users within their own restaurant
      const userToUpdate = await User.findById(userId);

      if (!userToUpdate)
        return res.status(404).json({ message: "User not found" });
      console.log("Update User 1");

      if (!userToUpdate.restaurantId) {
        return res
          .status(400)
          .json({ message: "User does not have a restaurantId" });
      }
      console.log("Test");

      // Check if the user to update belongs to the same restaurant as the admin
      if (
        userToUpdate.restaurantId.toString() !==
        req.user.restaurantId.toString()
      ) {
        return res.status(403).json({
          message:
            "Access denied. You can only update users in your restaurant.",
        });
      }
      console.log("Test2");

      // Restaurant Admin can update their details, but might not change roles or restaurant
      let { role, restaurantId, ...allowedUpdates } = updatedData;
      updatedData = allowedUpdates; // Don't allow role or restaurantId to be updated by restaurant admin

      // Now update the user for `restaurant_admin` as well
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      console.log("User updated successfully");
      return res.status(200).json(updatedUser);
    }

    // For `saas_admin`, they can update any user across any restaurant
    console.log(req.user.role);
    if (req.user.role === "saas_admin") {
      // Allow `saas_admin` to update any user
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
      });
      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      return res.status(200).json(updatedUser);
    }

    // If neither `saas_admin` nor `restaurant_admin`, deny access
    return res.status(403).json({ message: "Access denied." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete user (saas_admin can delete any user, restaurant_admin can only delete their staff but not themselves)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUser = req.user; // This represents the logged-in admin

    // Check if the logged-in user is a `restaurant_admin`
    if (loggedInUser.role === "restaurant_admin") {
      // Restaurant admin cannot delete themselves
      console.log(loggedInUser.role);
      if (userId === loggedInUser._id) {
        return res.status(403).json({ message: "You cannot delete yourself." });
      }

      // Check if the user to delete exists
      const userToDelete = await User.findById(userId);
      if (!userToDelete) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if the restaurantId is available and belongs to the same restaurant
      if (!userToDelete.restaurantId) {
        return res
          .status(400)
          .json({ message: "User does not belong to any restaurant." });
      }

      if (
        userToDelete.restaurantId.toString() !==
        loggedInUser.restaurantId.toString()
      ) {
        return res.status(403).json({
          message:
            "Access denied. You can only delete users in your restaurant.",
        });
      }

      // Proceed to delete the user within the same restaurant
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("test");
      return res.status(200).json({ message: "User deleted successfully" });
    }

    // For `saas_admin`, they can delete any user across any restaurant
    if (loggedInUser.role === "saas_admin") {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "User deleted successfully" });
    }

    // If neither `saas_admin` nor `restaurant_admin`, deny access
    return res.status(403).json({ message: "Access denied." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
