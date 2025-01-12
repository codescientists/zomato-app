const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const restaurantRoutes = require("./routes/restaurants");

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/restaurants", restaurantRoutes);


app.listen(8080, () => console.log("Server running on port 8080"));
