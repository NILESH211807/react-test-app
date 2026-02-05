const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwtToken");
const userModel = require("../models/user.model");

module.exports.checkAuth = async (req, res, next) => {
  const token = req.cookies.token;

  try {
    if (!token) {
      throw new AppError("Unauthorized access. Please login again.", 401);
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new AppError("Unauthorized access. Please login again.", 401);
    }

    const validateUser = await userModel.findById(decoded.id).lean();

    if (!validateUser) {
      throw new AppError("Unauthorized access. Please login again.", 401);
    }

    if (!validateUser.active) {
      throw new AppError("Account is not active. Please contact support.", 401);
    }

    req.user = validateUser;

    next();
  } catch (error) {
    next(error);
  }
};
