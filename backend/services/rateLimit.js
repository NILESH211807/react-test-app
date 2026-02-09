const { rateLimit } = require("express-rate-limit");

module.exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: {
    message: "Too many requests. Please try again later.",
  },
});

module.exports.otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,
  message: {
    message: "Too many requests. Please try again later.",
  },
});
