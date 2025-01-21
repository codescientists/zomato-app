const express = require("express");
const { getAllDishes, addDish, getDishesByRestaurant, getDishById, updateDish, deleteDish, getDishesByCategory } = require("../controllers/dishController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const router = express.Router();

// Get all dishes with their associated restaurants
router.get("/", getAllDishes);

// Add a new dish to a restaurant
router.post("/", authMiddleware, isAdmin, addDish);

// Fetch all dishes for a specific restaurant
router.get("/restaurant/:restaurantId", getDishesByRestaurant);

// Fetch a single dish by its ID
router.get("/:dishId", getDishById);

// Update a dish by its ID
router.put("/:dishId", authMiddleware, isAdmin, updateDish);

// Delete a dish by its ID
router.delete("/:dishId", authMiddleware, isAdmin, deleteDish);

// Fetch dishes by category (e.g., appetizers, main course, etc.)
router.get("/category/:categoryName", getDishesByCategory);

module.exports = router;
