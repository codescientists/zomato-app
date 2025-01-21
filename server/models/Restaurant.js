const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: "https://example.com/default-restaurant-logo.png", // Default logo URL
    },
    bannerImages: [
      {
        type: String, // URLs for restaurant images
      },
    ],
    category: {
      type: String,
      enum: [
        "Fast Food",
        "Casual Dining",
        "Fine Dining",
        "Cafe",
        "Street Food",
        "Bakery",
        "Bar",
        "Other",
      ],
      required: true,
    },

    // Location Details
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    // Contact Information
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    socialMediaLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
    },

    // Menu and Offerings
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
      },
    ],
    averageCostForTwo: {
      type: Number,
      required: true,
    },
    cuisines: {
      type: [String], // e.g., Indian, Chinese, Italian
    },

    // Business Information
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links to the User model
      required: true,
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["open", "closed", "temporarily_closed"],
      default: "open",
    },

    // Ratings and Reviews
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // Features and Tags
    tags: {
      type: [String], // e.g., "family-friendly", "live music"
    },
    facilities: {
      type: [String], // e.g., "Wi-Fi", "Parking", "Outdoor Seating"
    },
    paymentOptions: {
      type: [String], // e.g., "Cash", "Card", "UPI"
    },
    deliveryOptions: {
      type: [String], // e.g., "Dine-In", "Takeaway", "Delivery"
    },

    // Analytics and Insights
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    dailyViews: {
      type: Number,
      default: 0,
    },
    clickRate: {
      type: Number,
      default: 0, // Percentage of users clicking on the restaurant
    },

    // System Fields
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

// Geospatial Index for Location
RestaurantSchema.index({ location: "2dsphere" });

// Pre-save hook to calculate averageRating and reviewCount
RestaurantSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    this.averageRating =
      this.reviews.reduce((sum, review) => sum + review.rating, 0) /
      this.reviews.length;
    this.reviewCount = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.reviewCount = 0;
  }
  next();
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
