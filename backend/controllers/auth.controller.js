const asyncHandler = require("express-async-handler");
const authValidator = require("../validations/auth.validator");
const AppError = require("../utils/AppError");
const userModel = require("../models/user.model");
const { generateToken } = require("../utils/jwtToken");
const { comparePassword } = require("../utils/checkPassword");
const { setCookie } = require("../utils/cookie");

module.exports.signup = asyncHandler(async (req, res) => {
  const { error, value } = authValidator.signupValidator.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    const clearMessage = error.details[0].message.replace(/"/g, "");
    return res.status(400).json({ message: clearMessage });
  }

  const { name, email, password } = value;

  if (!name || !email || !password) {
    throw new AppError("All fields are required", 400);
  }

  const user = await userModel.findOne({ email }).lean();

  if (user) throw new AppError("Account already exists", 409);

  const createdUser = await userModel.create({
    name,
    email,
    password,
  });

  const token = generateToken({
    id: createdUser._id.toString(),
    email: createdUser.email,
  });

  // set cookie
  setCookie(res, token);

  res.status(201).json({
    message: "Account created successfully",
  });
});

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
