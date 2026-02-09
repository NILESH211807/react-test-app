const asyncHandler = require("express-async-handler");
const { clearCookie } = require("../utils/cookie");
const AppError = require("../utils/AppError");
const {
  profileValidator,
  changePasswordValidator,
} = require("../validations/user.validator");
const userModel = require("../models/user.model");
const { comparePassword } = require("../utils/checkPassword");

module.exports.getProfile = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user)
    throw new AppError("Unauthorized access. Please login again.", 401);

  let data = {
    id: user._id,
    name: user.name,
    email: user.email,
    active: user.active,
    createdAt: user.createdAt,
  };

  if (user.profile) {
    if (user.profile.startsWith("https://lh3.googleusercontent.com")) {
      data.profile = user.profile;
    } else {
      data.profile = `${process.env.BACKEND_BASE_URL}/${user.profile}`;
    }
  }

  res.status(200).json({
    message: "Profile fetched successfully",
    data: data,
  });
});

// update profile
module.exports.updateProfile = asyncHandler(async (req, res) => {
  const { error, value } = profileValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { name } = value;

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { name },
    { new: true },
  );

  res.status(200).json({
    message: "Profile updated successfully",
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      active: updatedUser.active,
      createdAt: updatedUser.createdAt,
    },
  });
});

// change password
module.exports.changePassword = asyncHandler(async (req, res) => {
  const { error, value } = changePasswordValidator.validate(req.body, {
    abortEarly: true,
  });
  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { oldPassword, newPassword } = value;

  if (!oldPassword || !newPassword)
    throw new AppError("All fields are required", 400);

  if (oldPassword === newPassword)
    throw new AppError("New password cannot be same as old password", 400);

  const userDoc = await userModel.findById(req.user._id).select("+password");

  if (!userDoc)
    throw new AppError("Unauthorized access. Please login again.", 401);

  const isMatched = await comparePassword(oldPassword, userDoc.password);

  if (!isMatched) throw new AppError("Invalid credentials", 401);

  // const otpDoc = await otpSchema
  //   .findOne({ email: userDoc.email })
  //   .select("+otp")
  //   .lean();

  // if (!otpDoc) throw new AppError("OTP expired. Please try again.", 400);

  // const isOtpExpired = otpDoc.expireAt < new Date();

  // if (isOtpExpired) throw new AppError("OTP expired. Please try again.", 400);

  // const isOtpMatched = await comparePassword(otp, otpDoc.otp);

  // if (!isOtpMatched) throw new AppError("Invalid OTP", 400);

  userDoc.password = newPassword;
  await userDoc.save();

  // delete otp
  // await otpSchema.deleteOne({ email: userDoc.email });

  res.status(200).json({
    message: "Password changed successfully",
  });
});

// logout
module.exports.logout = asyncHandler(async (req, res) => {
  clearCookie(res);
  res.status(200).json({
    message: "Logout successful",
  });
});

// uploadPicture
module.exports.uploadPicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("Profile image is required", 400);
  }

  const fileName = req.file.filename;
  const fileSize = req.file.size;

  if (fileSize > 1024 * 1024 * 5) {
    throw new AppError("File size is too large. Max 5MB", 400);
  }

  const imageType = ["image/png", "image/jpeg", "image/jpg"];

  if (!imageType.includes(req.file.mimetype)) {
    throw new AppError("File type not allowed", 400);
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    { profile: fileName },
    { new: true },
  );
  res.status(200).json({
    message: "profile uploaded successfully",
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      active: updatedUser.active,
      profile: `uploads/${updatedUser.profile}`,
      createdAt: updatedUser.createdAt,
    },
  });
});
