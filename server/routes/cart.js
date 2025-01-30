const express = require("express");
const {
  getCarts,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  checkoutCart,
  clearCart,
} = require("../controllers/cartController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all carts for the logged-in user
router.get("/", authMiddleware, getCarts);

// Add an item to a specific cart
router.post("/:restaurantId/items", authMiddleware, addItemToCart);

// Update an item in the cart
router.put("/:restaurantId/items/:itemId", authMiddleware, updateCartItem);

// Remove an item from the cart
router.delete("/:restaurantId/items/:itemId", authMiddleware, removeItemFromCart);

// Checkout a cart
router.post("/:restaurantId/checkout", authMiddleware, checkoutCart);

// Clear all items from a specific cart
router.delete("/:restaurantId/clear", authMiddleware, clearCart);

module.exports = router;
