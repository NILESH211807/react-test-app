const asyncHandler = require("express-async-handler");
const { clearCookie } = require("../utils/cookie");
const AppError = require("../utils/AppError");

module.exports.getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user)
    throw new AppError("Unauthorized access. Please login again.", 401);

  res.status(200).json({
    message: "Profile fetched successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      active: user.active,
      createdAt: user.createdAt,
    },
  });
});

// logout
module.exports.logout = asyncHandler(async (req, res) => {
  clearCookie(res);
  res.status(200).json({
    message: "Logout successful",
  });
});
