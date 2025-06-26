const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// 🔹 Register User (Signup)
router.post(
  "/signup",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("age", "Age is required and must be a number").isNumeric(),
  ],
  async (req, res) => {
    console.log("Received signup request:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, age } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // Hash Password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({ name, email, password: hashedPassword, age });
      await user.save();

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, age: user.age } });

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// 🔹 Login User
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    console.log("Login Request Data:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      console.log("Stored Hashed Password:", user.password);
      console.log("Entered Password:", password);

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, age: user.age } });

    } catch (err) {
      console.error("Error during login:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

module.exports = router;
