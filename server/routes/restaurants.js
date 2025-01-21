const express = require("express");
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantsController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const router = express.Router();

// Create a new restaurant
router.post("/", authMiddleware, isAdmin, createRestaurant);

// Get all restaurants with filtering, sorting, and pagination
router.get("/", getRestaurants);

// Get a specific restaurant by ID
router.get("/:id", getRestaurantById);

// Update a specific restaurant
router.put("/:id", authMiddleware, isAdmin, updateRestaurant);

// Delete a specific restaurant
router.delete("/:id", authMiddleware, isAdmin, deleteRestaurant);

module.exports = router;
