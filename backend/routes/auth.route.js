const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");
const { limiter, otpLimiter } = require("../services/rateLimit");

// send otp route
router.post("/send-otp", otpLimiter, authControllers.sendOTP);

// resend otp
router.post("/resend-otp", otpLimiter, authControllers.resendOTP);

// signup route
router.post("/signup", limiter, authControllers.signup);

// login route
router.post("/login", limiter, authControllers.login);

// forgot password route
router.put("/forgot-password", limiter, authControllers.forgotPassword);

// google auth route
router.get("/google", limiter, authControllers.googleAuthLogin);

module.exports = router;
