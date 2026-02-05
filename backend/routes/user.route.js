const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controller");
const { checkAuth } = require("../middlewares/auth");

// get profile
router.get("/", checkAuth, userControllers.getProfile);

// logout
router.post("/logout", checkAuth, userControllers.logout);

module.exports = router;
