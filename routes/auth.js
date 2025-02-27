const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");  // Import User Model

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
      // Extract user details
      const { name, email, password, role } = req.body;

      // Check if the user already exists (you might have this logic)
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, message: "User already exists!" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user with hashed password
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      // Check if the request is from a browser form submission
      if (req.headers.accept && req.headers.accept.includes("text/html")) {
          return res.redirect("/login.html"); // Redirect user to login page
      }

      // If request is from fetch API, return JSON response
      return res.json({ success: true, message: "User registered successfully!" });

  } catch (error) {
      console.error("Signup error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
          { id: user._id, name: user.name, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
      );

      res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
});



module.exports = router;
