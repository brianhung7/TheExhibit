const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// register GET
router.get("/register", (req, res) => {
    return res.render("auth/register");
});

// login GET
router.get("/login", (req, res) => {
    return res.render("auth/login");
});

module.exports = router;