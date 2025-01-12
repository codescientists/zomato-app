const express = require("express");
const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantsController");

const router = express.Router();

// Create a new restaurant
router.post("/", createRestaurant);

// Get all restaurants with filtering, sorting, and pagination
router.get("/", getRestaurants);

// Get a specific restaurant by ID
router.get("/:id", getRestaurantById);

// Update a specific restaurant
router.put("/:id", updateRestaurant);

// Delete a specific restaurant
router.delete("/:id", deleteRestaurant);

module.exports = router;
