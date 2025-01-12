const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    // Basic Order Details
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    taxAmount: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
    },

    // Payment Details
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "UPI", "PayPal"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      default: null,
    },

    // Delivery Details
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    deliveryStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    deliveryTime: {
      estimated: { type: Date },
      actual: { type: Date },
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPartner",
      default: null,
    },

    // Order Timing
    orderPlacedAt: {
      type: Date,
      default: Date.now,
    },
    orderUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    orderCancelledAt: {
      type: Date,
      default: null,
    },

    // Ratings and Feedback
    userRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    userFeedback: {
      type: String,
      trim: true,
    },
    restaurantRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    restaurantFeedback: {
      type: String,
      trim: true,
    },

    // Coupons and Offers
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },

    // Analytics
    isFirstOrder: {
      type: Boolean,
      default: false,
    },
    orderSource: {
      type: String,
      enum: ["mobile", "web", "other"],
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Geospatial Index for Delivery Address
OrderSchema.index({ "deliveryAddress.location": "2dsphere" });

module.exports = mongoose.model("Order", OrderSchema);
