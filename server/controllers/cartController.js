const User = require("../models/User");

// Get all active carts for the logged-in user (optimized)
exports.getCarts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: "carts",
        match: { status: "active" }, 
        populate: [{ path: "restaurant" }, { path: "items.menuItem" }],
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, carts: user.carts });
  } catch (error) {
    console.error("Error fetching carts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Add an item to a specific cart
exports.addItemToCart = async (req, res) => {
    const { restaurantId } = req.params;
    const { menuItemId, name, price, quantity } = req.body;
  
    try {
      // Fetch the user and populate carts with restaurant and menu item details
      const user = await User.findById(req.user.userId).populate("carts.restaurant carts.items.menuItem");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Find the active cart for the specified restaurant
      let cart = user.carts.find(
        (c) => c.restaurant._id.toString() === restaurantId && c.status === "active"
      );

      // If no active cart exists, create a new one
      if (!cart) {
        cart = {
          restaurant: restaurantId,
          items: [],
          totalPrice: 0,
          status: "active",
        };
        cart.items.push({
          menuItem: menuItemId,
          name,
          price,
          quantity,
        });
        user.carts.push(cart);
      }
      else{
        // Check if the item already exists in the cart
        const existingItem = cart.items.find((item) => item.menuItem._id.toString() === menuItemId);
    
        if (existingItem) {
          // If item exists, update the quantity
          existingItem.quantity += quantity;
        } else {
          // Add new item to the cart
          cart.items.push({
            menuItem: menuItemId,
            name,
            price,
            quantity,
          });
        }
      }
  
      // Update the total price of the cart
      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      // Save the user with updated cart details
      await user.save();
  
      // Fetch the updated cart to include populated restaurant and menu item details
      const updatedCart = await User.findById(req.user.userId)
        .select("carts")
        .populate("carts.restaurant carts.items.menuItem");

      // Respond with success and the updated cart
      res.status(200).json({ success: true, cart: updatedCart.carts.find((c) => c.restaurant._id.toString() === restaurantId) });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ error: "Server error" });
    }
};
  

// Update an item in the cart
exports.updateCartItem = async (req, res) => {
  const { restaurantId, itemId } = req.params;
  const { quantity } = req.body;
  try {
    const user = await User.findById(req.user.userId).populate("carts.restaurant carts.items.menuItem");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = user.carts.find(
      (c) => c.restaurant._id.toString() === restaurantId
    );

    if (!cart || cart.status !== "active") {
      return res.status(404).json({ error: "Cart not found or already checked out" });
    }

    const item = cart.items.find(
      (i) => i._id.toString() === itemId
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    item.quantity = quantity;

    // Update total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await user.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Remove an item from the cart
exports.removeItemFromCart = async (req, res) => {
  const { cartId, itemId } = req.params;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = user.carts.id(cartId);

    if (!cart || cart.status !== "active") {
      return res.status(404).json({ error: "Cart not found or already checked out" });
    }

    cart.items.id(itemId).remove();

    // Update total price
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

    await user.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Checkout a cart
exports.checkoutCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = user.carts.id(cartId);

    if (!cart || cart.status !== "active") {
      return res.status(404).json({ error: "Cart not found or already checked out" });
    }

    // Mark cart as checked out
    cart.status = "checked-out";
    cart.updatedAt = Date.now();

    await user.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error checking out cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Clear all items from a specific cart
exports.clearCart = async (req, res) => {
  const { cartId } = req.params;

  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cart = user.carts.id(cartId);

    if (!cart || cart.status !== "active") {
      return res.status(404).json({ error: "Cart not found or already checked out" });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await user.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Server error" });
  }
};
