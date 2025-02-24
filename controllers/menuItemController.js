const MenuItem = require("../models/menuItem");

// Create a new menu item (Only restaurant_admin via middleware)
exports.createMenuItem = async (req, res) => {
  try {
    const {
      name,
      title,
      desc,
      category,
      type,
      price,
      size,
      altImage,
      image,
      currency,
      rating,
      spicy_prefer,
      disclaimer,
      available,
      imageSlider,
    } = req.body;

    const menuItem = new MenuItem({
      name,
      title,
      desc,
      category,
      type,
      price,
      size,
      currency,
      rating,
      spicy_prefer,
      disclaimer,
      available,
      altImage,
      image,
      imageSlider,
      restaurantId: req.user.restaurantId, // Ensure menu item is linked to the restaurant
    });

    await menuItem.save();
    res
      .status(201)
      .json({ message: "Menu item created successfully!", menuItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating menu item", error: error.message });
  }
};

// Get all menu items for the logged-in restaurant
exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({
      restaurantId: req.user.restaurantId,
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu items", error: error.message });
  }
};

// Get a single menu item by ID (Ensures it belongs to the restaurant)
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findOne({
      _id: req.params.id,
      restaurantId: req.user.restaurantId,
    });

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching menu item", error: error.message });
  }
};

// Update a menu item (Only restaurant_admin via middleware)
exports.updateMenuItem = async (req, res) => {
  try {
    const {
      name,
      title,
      desc,
      category,
      type,
      price,
      size,
      altImage,
      image,
      currency,
      rating,
      spicy_prefer,
      disclaimer,
      available,
      imageSlider,
    } = req.body;

    const updatedMenuItem = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, restaurantId: req.user.restaurantId },
      {
        name,
        title,
        desc,
        category,
        type,
        price,
        size,
        currency,
        rating,
        spicy_prefer,
        disclaimer,
        available,
        altImage,
        image,
        imageSlider,
      },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res
      .status(200)
      .json({ message: "Menu item updated successfully!", updatedMenuItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating menu item", error: error.message });
  }
};

// Delete a menu item (Only restaurant_admin via middleware)
exports.deleteMenuItem = async (req, res) => {
  try {
    const deletedMenuItem = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      restaurantId: req.user.restaurantId,
    });

    if (!deletedMenuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({ message: "Menu item deleted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting menu item", error: error.message });
  }
};
