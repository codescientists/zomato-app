const Restaurant = require("../models/Restaurant");

// Create a new restaurant
exports.createRestaurant = async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all restaurants with filtering, sorting, and pagination
exports.getRestaurants = async (req, res) => {
  try {
    const {
      name,
      city,
      cuisine,
      minRating,
      maxDeliveryFee,
      sortBy,
      limit = 10,
      page = 1,
    } = req.query;

    // const filter = {};
    // if (name) filter.name = new RegExp(name, "i");
    // if (city) filter.address.city = new RegExp(city, "i");
    // if (cuisine) filter.cuisine = { $in: cuisine.split(",") };
    // if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    // if (maxDeliveryFee) filter.deliveryFee = { $lte: parseFloat(maxDeliveryFee) };

    // const sort = {};
    // if (sortBy) {
    //   const parts = sortBy.split(":");
    //   sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    // }

    // const restaurants = await Restaurant.find(filter)
    //   .sort(sort)
    //   .skip((page - 1) * limit)
    //   .limit(parseInt(limit));

    const restaurants = [
      {
        name: "Spicy Bites",
        cuisine: ["Indian", "Chinese"],
        rating: 4.5,
        address: {
          street: "123 Curry Lane",
          city: "Mumbai",
          state: "Maharashtra",
          country: "India",
          postalCode: "400001",
        },
        location: {
          type: "Point",
          coordinates: [72.8777, 19.0760],
        },
        deliveryFee: 50,
        averageCost: 500,
        contact: {
          phone: "+91-9876543210",
          email: "spicybites@example.com",
        },
        openingHours: {
          start: "10:00 AM",
          end: "11:00 PM",
        },
        isVegetarian: false,
        image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/09/83/03/03/china-1.jpg?w=900&h=500&s=1", // Indian-Chinese restaurant dish
      },
      {
        name: "Green Delight",
        cuisine: ["Vegetarian", "Salads"],
        rating: 4.8,
        address: {
          street: "456 Healthy St",
          city: "Bangalore",
          state: "Karnataka",
          country: "India",
          postalCode: "560001",
        },
        location: {
          type: "Point",
          coordinates: [77.5946, 12.9716],
        },
        deliveryFee: 30,
        averageCost: 400,
        contact: {
          phone: "+91-9876543211",
          email: "greendelight@example.com",
        },
        openingHours: {
          start: "9:00 AM",
          end: "10:00 PM",
        },
        isVegetarian: true,
        image: "https://images.immediate.co.uk/production/volatile/sites/30/2014/05/Epic-summer-salad-hub-2646e6e.jpg?quality=90&webp=true&resize=375,341", // Fresh salad bowl
      },
      {
        name: "Taco Fiesta",
        cuisine: ["Mexican"],
        rating: 4.2,
        address: {
          street: "789 Fiesta Blvd",
          city: "Delhi",
          state: "Delhi",
          country: "India",
          postalCode: "110001",
        },
        location: {
          type: "Point",
          coordinates: [77.2090, 28.6139],
        },
        deliveryFee: 60,
        averageCost: 550,
        contact: {
          phone: "+91-9876543212",
          email: "tacofiesta@example.com",
        },
        openingHours: {
          start: "11:00 AM",
          end: "12:00 AM",
        },
        isVegetarian: false,
        image: "https://www.howtocook.recipes/wp-content/uploads/2022/01/Mexican-tacos-recipe.jpg", // Mexican tacos
      },
      {
        name: "Sushi World",
        cuisine: ["Japanese", "Seafood"],
        rating: 4.7,
        address: {
          street: "101 Sushi Lane",
          city: "Chennai",
          state: "Tamil Nadu",
          country: "India",
          postalCode: "600001",
        },
        location: {
          type: "Point",
          coordinates: [80.2707, 13.0827],
        },
        deliveryFee: 80,
        averageCost: 1200,
        contact: {
          phone: "+91-9876543213",
          email: "sushiworld@example.com",
        },
        openingHours: {
          start: "12:00 PM",
          end: "10:00 PM",
        },
        isVegetarian: false,
        image: "https://japanesetaste.in/cdn/shop/articles/how-to-make-makizushi-sushi-rolls-japanese-taste.jpg?v=1707914944&width=1600", // Sushi platter
      },
      {
        name: "Pizza Paradise",
        cuisine: ["Italian", "Pizza"],
        rating: 4.6,
        address: {
          street: "555 Pizza Street",
          city: "Pune",
          state: "Maharashtra",
          country: "India",
          postalCode: "411001",
        },
        location: {
          type: "Point",
          coordinates: [73.8567, 18.5204],
        },
        deliveryFee: 40,
        averageCost: 700,
        contact: {
          phone: "+91-9876543214",
          email: "pizzaparadise@example.com",
        },
        openingHours: {
          start: "11:00 AM",
          end: "11:00 PM",
        },
        isVegetarian: false,
        image: "https://content.jdmagicbox.com/v2/comp/mumbai/i5/022pxx22.xx22.181204181754.h1i5/catalogue/lavera-pizza-kharghar-navi-mumbai-inexpensive-restaurants-below-rs-500--038qps39dw.jpg", // Delicious pizza
      },
    ];
    


    // const total = await Restaurant.countDocuments(filter);
    const total = 10

    res.status(200).json({
      success: true,
      data: restaurants,
      pagination: {
        total,
        limit: parseInt(limit),
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a specific restaurant by ID
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update a restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ success: false, error: "Restaurant not found" });

    res.status(200).json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


