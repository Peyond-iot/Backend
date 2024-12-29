const MenuItem = require("../models/menuItem");
const path = require("path");
const fs = require("fs");
const dir = "localStorage";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir); // Create directory if it doesn't exist
}
// Multer setup for image upload
const multer = require("multer");

// Storage setup for multer: define destination and file naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "localStorage/"); // Save files to 'localStorage' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., '1623761881784.jpg'
  },
});

// Set upload limits and file type restrictions
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB max file size
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
  },
});

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new menu item with image upload
exports.createMenuItem = async (req, res) => {
  const menuItem = new MenuItem({
    image: req.file
      ? `http://localhost:${process.env.PORT || 5000}/localStorage/${
          req.file.filename
        }`
      : req.body.image,
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

// Update a menu item (including image)
exports.updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // Update fields
    menuItem.image = req.file
      ? `http://localhost:${process.env.PORT || 5000}/localStorage/${
          req.file.filename
        }`
      : req.body.image || menuItem.image;
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

// Delete a menu item (also delete associated image file)
exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ message: "Menu item not found" });

    // Delete associated image if exists
    if (menuItem.image) {
      const imagePath = menuItem.image.replace(
        `http://localhost:${process.env.PORT || 5000}/`,
        ""
      );
      fs.unlinkSync(imagePath); // Delete image from local storage
    }

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export multer's upload method to use in routes
exports.upload = upload;
