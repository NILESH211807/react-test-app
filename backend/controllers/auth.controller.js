const asyncHandler = require("express-async-handler");
const authValidator = require("../validations/auth.validator");
const AppError = require("../utils/AppError");
const userModel = require("../models/user.model");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword } = require("../utils/checkPassword");
const { setCookie } = require("../utils/cookie");
const generateOTP = require("../utils/generateOTP");
const { sendMailForOTP } = require("../services/sendMail");
const { addCache, getCache, deleteCache } = require("../services/redis");
const { hashOTP } = require("../utils/hashText");
const { getGoogleProfile } = require("../services/googleAuth");
const authConfig = require("../config/googleConfig");

// sendOTP
module.exports.sendOTP = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.sendOTPValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { email, type } = value;

  if (!email || !type) throw new AppError("All fields are required", 400);

  if (type === "signup") {
    const user = await userModel.findOne({ email }).lean();
    if (user) throw new AppError("Account already exists", 409);
  } else if (type === "forgot-password") {
    const user = await userModel.findOne({ email }).lean();
    if (!user) throw new AppError("Account does not exists", 404);
  }

  // generate otp
  const otp = generateOTP();
  const key = `otps:${type}:${email}`;

  const cachedOTP = await getCache(key);

  if (cachedOTP) await deleteCache(key);

  const hashedOTP = await hashOTP(otp);

  await addCache(key, hashedOTP);

  try {
    await sendMailForOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to your email",
      email,
    });
  } catch (err) {
    throw new AppError("Failed to send OTP. Please try again.", 500);
  }
});
// resendOTP
module.exports.resendOTP = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.sendOTPValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { email, type } = value;

  if (!email || !type) throw new AppError("All fields are required", 400);

  if (type === "signup") {
    const user = await userModel.findOne({ email }).lean();
    if (user) throw new AppError("Account already exists", 409);
  } else if (type === "forgot-password") {
    const user = await userModel.findOne({ email }).lean();
    if (!user) throw new AppError("Account does not exists", 404);
  }

  const key = `otps:${type}:${email}`;

  const cachedOTP = await getCache(key);

  if (cachedOTP) await deleteCache(key);

  const otp = generateOTP();

  const hashedOTP = await hashOTP(otp);
  await addCache(key, hashedOTP);

  try {
    await sendMailForOTP(email, otp);

    res.status(200).json({
      message: "OTP resent to your email",
      email: email,
    });
  } catch (err) {
    throw new AppError("Failed to resend OTP. Please try again.", 500);
  }
});
// signup
module.exports.signup = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.signupValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { name, email, password, otp } = value;

  if (!name || !email || !password || !otp) {
    throw new AppError("All fields are required", 400);
  }

  const user = await userModel.findOne({ email }).lean();

  if (user) throw new AppError("Account already exists", 409);

  const key = `otps:signup:${email}`;

  const cachedOtp = await getCache(key);

  if (!cachedOtp) throw new AppError("OTP expired. Please try again.", 400);

  const isMatchedOtp = await comparePassword(otp, cachedOtp);

  if (!isMatchedOtp) throw new AppError("Invalid OTP", 400);

  const createdUser = await userModel.create({
    name,
    email,
    password,
    isVerified: true,
  });

  const token = generateToken({
    id: createdUser._id.toString(),
    email: createdUser.email,
  });

  await deleteCache(key);

  // set cookie
  setCookie(res, token);

  res.status(201).json({
    message: "Account created successfully",
  });
});
// login
module.exports.login = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.loginValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { email, password } = value;

  if (!email || !password) throw new AppError("All fields are required", 400);

  const user = await userModel.findOne({ email }).select("+password").lean();

  if (!user) throw new AppError("Account does not exists", 404);

  if (!user.active) throw new AppError("Account is not active", 401);

  const isMatched = await comparePassword(password, user.password);

  if (!isMatched) throw new AppError("Invalid credentials", 401);

  const token = generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  // set cookie
  setCookie(res, token);

  res.status(200).json({
    message: "Login successful",
  });
});
// forgot password
module.exports.forgotPassword = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.forgotPasswordValidator.validate(
    req.body,
    { abortEarly: true },
  );

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { email, otp, newPassword } = value;

  if (!email || !otp || !newPassword) {
    throw new AppError("All fields are required", 400);
  }

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) throw new AppError("Account does not exists", 404);

  const key = `otps:forgot-password:${email}`;
  const cachedOtp = await getCache(key);

  if (!cachedOtp) throw new AppError("OTP expired. Please try again.", 400);

  const isMatchedOtp = await comparePassword(otp, cachedOtp);

  if (!isMatchedOtp) throw new AppError("Invalid OTP", 400);

  user.password = newPassword;
  await user.save();

  // delete otp from cache
  await deleteCache(key);

  res.status(200).json({
    message: "Password changed successfully",
  });
});

// googleAuth
module.exports.googleAuthLogin = asyncHandler(async (req, res) => {
  const { code } = req.query;

  if (!code) throw new AppError("Invalid request. Please try again.", 400);

  try {
    const { tokens } = await authConfig.getToken(code);

    authConfig.setCredentials(tokens);

    const { name, email, picture } = await getGoogleProfile(
      tokens.access_token,
    );

    let user = await userModel.findOne({ email }).lean();

    if (!user) {
      user = await userModel.create({
        name,
        email,
        password: email,
        isVerified: true,
        profile: picture,
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    // set cookie
    setCookie(res, token);

    res.status(201).json({
      message: "success",
      token,
    });
  } catch (error) {
    console.error("OAuth Error:", error.response?.data);
    throw new AppError("Authentication failed", 401);
  }
});
