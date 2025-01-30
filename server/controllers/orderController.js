const Order = require("../models/Order");

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { items, restaurant, deliveryAddress, paymentMethod, orderSource } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const finalAmount = totalAmount; // Adjust for tax, delivery fees, discounts, etc.

    const newOrder = new Order({
      user: req.user._id,
      restaurant,
      items,
      totalAmount,
      finalAmount,
      paymentMethod,
      deliveryAddress,
      orderSource,
      isFirstOrder: req.user.ordersCount === 0, // Example condition
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("restaurant", "name address")
      .populate("deliveryPartner", "name contact");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "name address");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by user
exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate("restaurant", "name address");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { deliveryStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryStatus, orderUpdatedAt: Date.now() },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryStatus === "delivered" || order.deliveryStatus === "cancelled") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.deliveryStatus = "cancelled";
    order.orderCancelledAt = Date.now();
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
