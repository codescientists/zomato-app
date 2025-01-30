const express = require("express");
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getUser,
  signupWithSocial,
} = require("../controllers/authController");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");

const   router = express.Router();

// Register a new user
router.post("/register", register);

router.post("/signup-with-social", signupWithSocial);

// Login a user
router.post("/login", login);

// Forgot password (send reset link)
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password", resetPassword);

// Route to get the logged-in user's details
router.get("/me", authMiddleware, getUser);


module.exports = router;
