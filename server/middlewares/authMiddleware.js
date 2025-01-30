const JWT = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success:false, error: "Authorization token is missing" });
  }

  try { 
    const decode = JWT.verify(
      token,
      process.env.JWT_SECRET
    );
    
    if (decode) {
      req.user = decode;
      next();
    }
  } catch (error) {
    return res.status(401).json({ success:false, error: "Invalid or expired token" });
  }
};

const isRestaurantOwner = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user || user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Role Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    
    if (req.user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Role Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};

module.exports = {authMiddleware, isAdmin};
