const Dish = require("../models/Dish");
const Restaurant = require("../models/Restaurant");

// Add a new dish to a restaurant
exports.addDish = async (req, res) => {
  try {
    const { restaurantId, name, description, price, originalPrice, category, isAvailable, imageUrl, images, tags } =
      req.body;

    // Validate input
    if (!restaurantId || !name || !price || !category || !originalPrice) {
      return res.status(400).send({
        success: false,
        message: "Required fields: restaurantId, name, price, and category",
      });
    }

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Create a new dish
    const newDish = new Dish({
      name,
      description,
      price,
      originalPrice,
      category,
      isAvailable,
      imageUrl,
      images,
      tags,
      restaurant: restaurantId,
    });

    const savedDish = await newDish.save();

    // Add the dish to the restaurant's menu
    restaurant.menu.push(savedDish._id);
    await restaurant.save();

    res.status(201).send({
      success: true,
      message: "Dish added successfully",
      data: savedDish,
    });
  } catch (error) {
    console.error("Error adding dish:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to add dish",
    });
  }
};

// Fetch all dishes for all restaurant
exports.getAllDishes = async (req, res) => {
  try {
    // Fetch dishes for the restaurant
    const dishes = await Dish.find().populate('restaurant');

    res.status(200).send({
      success: true,
      message: "Dishes fetched successfully",
      data: dishes,
    });
  } catch (error) {
    console.error("Error fetching dishes:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to fetch dishes",
    });
  }
};

// Fetch all dishes for a specific restaurant
exports.getDishesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Fetch dishes for the restaurant
    const dishes = await Dish.find({ restaurant: restaurantId }).populate("restaurant");

    res.status(200).send({
      success: true,
      message: "Dishes by restaurant fetched successfully",
      data: dishes,
    });
  } catch (error) {
    console.error("Error fetching dishes:", error.message);
    res.status(500).send({
      success: false,
      message: "Failed to fetch dishes",
    });
  }
};

// Get a single dish by ID
exports.getDishById = async (req, res) => {
  try {
    const { dishId } = req.params;
    const dish = await Dish.findById(dishId).populate("restaurant");

    if (!dish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.status(200).json({
      success: true,
      message: "Dish fetched successfully",
      data: dish,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dish" });
  }
};

// Update a dish by ID
exports.updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const updates = req.body;

    const updatedDish = await Dish.findByIdAndUpdate(dishId, updates, { new: true });

    if (!updatedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.status(200).json({
      success: true,
      message: "Updated dish successfully",
      data: updatedDish,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update dish" });
  }
};

// Delete a dish by ID
exports.deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;

    const deletedDish = await Dish.findByIdAndDelete(dishId);

    if (!deletedDish) {
      return res.status(404).json({ error: "Dish not found" });
    }

    res.status(200).json({ success: true, message: "Dish deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete dish" });
  }
};

// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const dishes = await Dish.find({ category: categoryName });

    res.status(200).json({
      success: true,
      message: "Dishes fetched successfully",
      data: dishes,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dishes by category" });
  }
};