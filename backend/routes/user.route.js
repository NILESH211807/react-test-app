const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/auth");
const { limiter } = require("../services/rateLimit");
const { upload } = require("../middlewares/upload");

// get profile
router.get("/", checkAuth, limiter, userControllers.getProfile);

// update profile
router.put(
  "/update-profile",
  checkAuth,
  limiter,
  userControllers.updateProfile,
);

// change password
router.put(
  "/change-password",
  checkAuth,
  limiter,
  userControllers.changePassword,
);

// logout
router.post("/logout", checkAuth, limiter, userControllers.logout);

// upload picture
router.post(
  "/upload-picture",
  checkAuth,
  limiter,
  upload.single("file"),
  userControllers.uploadPicture,
);

module.exports = router;
