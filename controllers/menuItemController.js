const MenuItem = require("../models/menuItem");

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new menu item with an image link
exports.createMenuItem = async (req, res) => {
  const menuItem = new MenuItem({
    image: req.body.image, // Accept the image URL directly
    altImage: req.body.altImage,
    title: req.body.title,
    desc: req.body.desc,
    category: req.body.category,
    type: req.body.type,
    disclaimer: req.body.disclaimer,
    rating: req.body.rating,
    price: req.body.price,
    currency: req.body.currency,
    imageSlider: req.body.imageSlider,
    spicy_prefer: req.body.spicy_prefer,
  });

  try {
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // Update fields
    menuItem.image = req.body.image || menuItem.image;
    menuItem.altImage = req.body.altImage || menuItem.altImage;
    menuItem.title = req.body.title || menuItem.title;
    menuItem.desc = req.body.desc || menuItem.desc;
    menuItem.category = req.body.category || menuItem.category;
    menuItem.type = req.body.type || menuItem.type;
    menuItem.disclaimer = req.body.disclaimer || menuItem.disclaimer;
    menuItem.rating = req.body.rating || menuItem.rating;
    menuItem.price = req.body.price || menuItem.price;
    menuItem.currency = req.body.currency || menuItem.currency;
    menuItem.imageSlider = req.body.imageSlider || menuItem.imageSlider;
    menuItem.spicy_prefer =
      req.body.spicy_prefer !== undefined
        ? req.body.spicy_prefer
        : menuItem.spicy_prefer;

    const updatedMenuItem = await menuItem.save();
    res.json(updatedMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
