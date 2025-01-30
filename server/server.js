const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const restaurantRoutes = require("./routes/restaurants");
const authRoutes = require("./routes/auth");
const dishRoutes = require("./routes/dishes");
const cartRoutes = require("./routes/cart");
const ordersRoutes = require("./routes/orders");

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/dishes", dishRoutes);
app.use("/api/v1/carts", cartRoutes);
app.use("/api/v1/orders", ordersRoutes);

app.listen(8080, () => console.log("Server running on port 8080"));
