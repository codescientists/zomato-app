  const mongoose = require("mongoose");

  const UserSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
      },
      phoneNumber: {
        type: String,
        unique: true,
      },
      role: {
        type: String,
        enum: ["user", "restaurant_owner", "admin"],
        default: "user",
      },

      // Profile Fields
      avatar: {
        type: String,
        default: "https://example.com/default-avatar.png", // Default avatar URL
      },
      address: {
        type: String, 
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
      favorites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
        },
      ],
      dietaryPreferences: {
        type: [String],
        enum: ["vegan", "vegetarian", "non-vegetarian", "halal", "kosher"],
      },

      // Cart (Multi-Cart System)
      carts: [
        {
          restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
          },
          items: [
            {
              menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dish",
                required: true,
              },
              name: {
                type: String,
                required: true,
              },
              price: {
                type: Number,
                required: true,
              },
              quantity: {
                type: Number,
                required: true,
                min: 1,
              },
            },
          ],
          totalPrice: {
            type: Number,
            default: 0,
          },
          status: {
            type: String,
            enum: ["active", "checked-out"],
            default: "active",
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
      ],


      // Advanced Fields
      rewardPoints: {
        type: Number,
        default: 0,
      },
      orderHistory: [
        {
          orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      paymentMethods: [
        {
          type: {
            type: String,
            enum: ["card", "paypal", "upi"],
          },
          details: {
            type: Map,
            of: String, // Example: { "cardNumber": "1234", "expiry": "12/24" }
          },
        },
      ],
      notifications: [
        {
          type: {
            type: String,
            enum: ["order", "promotion", "system"],
          },
          message: {
            type: String,
          },
          read: {
            type: Boolean,
            default: false,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],

      // Analytics and Personalization
      lastLogin: {
        type: Date,
      },
      loginHistory: [
        {
          ip: String,
          device: String,
          loggedInAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      preferences: {
        darkMode: {
          type: Boolean,
          default: false,
        },
        language: {
          type: String,
          default: "en",
        },
        preferredCuisine: {
          type: [String],
        },
      },
      subscription: {
        type: {
          type: String,
          enum: ["free", "premium"],
          default: "free",
        },
        expiresAt: {
          type: Date,
        },
      },

      // System Fields
      isVerified: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
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
      timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
  );

  // Geospatial Index for Location
  UserSchema.index({ location: "2dsphere" });

  module.exports = mongoose.model("User", UserSchema);
