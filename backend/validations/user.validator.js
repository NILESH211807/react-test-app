const Joi = require("joi");

module.exports.profileValidator = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z ]+$/)
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 3 characters",
      "string.max": "Name must be less than 20 characters",
      "string.regex.base": "Name must be alphabets and spaces",
    }),
});

// change password
module.exports.changePasswordValidator = Joi.object({
  oldPassword: Joi.string().trim().required().min(6).max(20).messages({
    "string.empty": "Old password is required",
    "string.min": "Old password must be at least 6 characters",
    "string.max": "Old password must be less than 20 characters",
  }),
  newPassword: Joi.string().trim().required().min(6).max(20).messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters",
    "string.max": "New password must be less than 20 characters",
  }),
});
