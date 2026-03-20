const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateSignup, validateLogin } = require("../middleware/validation");
const { authLimiter } = require("../middleware/rateLimiter");

// @route   POST api/auth/signup
// @desc    Register user
router.post("/signup", authLimiter, validateSignup, async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ username, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post("/login", authLimiter, validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
