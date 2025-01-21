const mongoose = require("mongoose");

const DishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Untitled Dish",
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage", "Other"],
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: "https://example.com/default-dish-image.png", // Default dish image URL
    },
    images: {
      type: [String],
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Draft",
    },
    tags: {
      type: [String], // e.g., "spicy", "vegan", "gluten-free"
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Dish", DishSchema);
