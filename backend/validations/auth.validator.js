const Joi = require("joi");

// otp send schema
module.exports.sendOTPValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  type: Joi.string().valid("signup", "forgot-password").required().messages({
    "any.only": "Invalid type",
  }),
});

// signup validator
module.exports.signupValidator = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be less than 20 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than 20 characters",
  }),
  otp: Joi.string().min(6).max(6).required().messages({
    "string.empty": "OTP is required",
    "string.min": "Invalid OTP",
    "string.max": "Invalid OTP",
  }),
});

// login validator
module.exports.loginValidator = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password must be less than 20 characters",
  }),
});

// forgotPasswordValidator
module.exports.forgotPasswordValidator = Joi.object({
  email: Joi.string().trim().required().email().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  otp: Joi.string().min(6).max(6).required().messages({
    "string.empty": "OTP is required",
    "string.min": "Invalid OTP",
    "string.max": "Invalid OTP",
  }),
  newPassword: Joi.string().min(6).max(20).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than 20 characters",
  }),
});
