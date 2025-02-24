const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the menu item
    title: { type: String, required: true }, // Title of the item
    desc: { type: String, required: true }, // Description of the item
    category: { type: String, required: true }, // Category (e.g., Beverages, Main Course)
    type: { type: String, required: true, enum: ["veg", "non-veg"] }, // Veg/Non-Veg
    price: { type: Number, required: true }, // Price of the item
    currency: { type: String, required: true, default: "रु." }, // Currency (default रु.)
    size: {
      type: String,
      enum: ["small", "medium", "large"],
      default: "medium",
    }, // Size options
    rating: { type: Number, default: 0 }, // Rating (optional)
    spicy_prefer: { type: Boolean, default: false }, // Spice preference
    disclaimer: { type: String, default: "" }, // Disclaimer message
    available: { type: Boolean, default: true }, // Availability status
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    }, // Reference to restaurant
    image: { type: String, default: "" }, // Main image URL
    altImage: { type: String, required: true }, // Alternative image URL
    imageSlider: [
      {
        src: { type: String },
        id: { type: String },
        alt: { type: String },
      },
    ], // Array of images for a slider
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", MenuItemSchema);
