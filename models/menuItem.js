const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: false,
      default: "",
    },
    altImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["veg", "non-veg"],
    },
    disclaimer: {
      type: String,
      required: false,
      default: "",
    },
    rating: {
      type: Number,
      required: false,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "रु.",
    },
    imageSlider: [
      {
        src: {
          type: String,
          required: false,
        },
        id: {
          type: String,
          required: false,
        },
        alt: {
          type: String,
          required: false,
        },
      },
    ],
    spicy_prefer: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
