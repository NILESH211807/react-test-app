const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth.controller");

// signup route
router.post("/signup", authControllers.signup);

// login route
router.post("/login", authControllers.login);

module.exports = router;
