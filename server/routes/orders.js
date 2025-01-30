const express = require("express");
const {
  placeOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrdersByUser,
} = require("../controllers/orderController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Place a new order
router.post("/", authMiddleware, placeOrder);

// Get a single order by ID
router.get("/:orderId", authMiddleware, getOrderById);

// Get all orders (Admin only)
router.get("/", authMiddleware, isAdmin, getAllOrders);

// Get orders by user
router.get("/user/:userId", authMiddleware, getOrdersByUser);

// Update order status
router.put("/:orderId/status", authMiddleware, isAdmin, updateOrderStatus);

// Cancel an order
router.put("/:orderId/cancel", authMiddleware, cancelOrder);

module.exports = router;
