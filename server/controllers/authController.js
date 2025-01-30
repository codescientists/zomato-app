const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// Secret keys (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "fdlksa&32;afd8932fdj";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function separateEmail(email) {
  const [username, domain] = email.split('@');
  return { username, domain };
}


// Registration Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ 
      success: true, 
      token, 
      name: user.name,
      email: user.email,
      role: user.role,
      user: user,
      message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

exports.signupWithSocial = (req, res) => {
  try {
      const { email } = req.body;
      
      //validation
      if (!email) {
        return res.status(200).send({
          success: false,
          message: "Email is missing",
        });
      }

      const separated = separateEmail(email);

      //check user
      User.find({ email: email }).then(user => {
          if (user.length == 0) {
            const user = new User({
                email: email,
                name: separated.username,
            });

            user.save().then(result => {
                const token = jwt.sign({ _id: result._id, role: result.role }, process.env.JWT_SECRET, {
                    expiresIn: "7d",
                });

                return res.json({
                    success: true,
                    message: "Created user successfully!",
                    user: {
                        _id: result._id,
                        role: result.role,
                        token, 
                    },
                });
            })
          }
          else {
            user = user[0]

            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "7d",
            });

            res.status(200).send({
                success: true,
                message: "login successfully",
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                },
            });
          }
      })

  } catch (error) {
      console.log(error)
      res.status(500).send({
          success: false,
          message: "Error in login",
          error,
      });
  }
}


// Email Verification Controller
exports.verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Forgot Password Controller
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the reset token via email (mocked here)
    console.log(`Reset token for ${email}: ${resetToken}`);

    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Reset Password Controller
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Logout Controller
exports.logout = (req, res) => {
  // Invalidate JWT by removing it on the client side (no server-side state required for JWT)
  res.status(200).json({ message: "Logout successful." });
};

// Get logged-in user details
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = {
      success: true,
      role: user?.role,
      user: user
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
