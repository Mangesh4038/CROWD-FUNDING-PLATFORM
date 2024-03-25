// Import necessary modules

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/token");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const mailsend = require("../middleware/mailsender");
const crypto=require("crypto")
// const cookieParser = require('cookie-parser');
require("dotenv").config();


// Creating a user


// Generate a random secret key
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Creating a user
router.post(
  "/create-user",
  // Validation for incoming request
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Check if the user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, a user with this email already exists",
        });
      }
      // Hash the password
      let salt = await bcrypt.genSalt(10);
      let secured = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      let userData = await User.create({
        name: req.body.name,
        password: secured,
        email: req.body.email,
      });
      // Generate authentication token
      const data = {
        user: {
          id: userData.id,
        },
      };
      const token = jwt.sign(data, process.env.JWT_SECRET);
      // Generate a random activation token secret
      const activationTokenSecret = generateSecret();
      let emailCode = jwt.sign(data, activationTokenSecret, {
        expiresIn: "20m",
      });
      let vericationEmailLink = `${process.env.CLIENT_URL}/activate/${emailCode}`;
      // Save activation token to the database
      await Token.create({
        userId: userData.id,
        token: emailCode,
      });
      // Send verification email
      await mailsend({
        email: userData.email,
        subject: "Verification Mail",
        url: vericationEmailLink,
        name: userData.name,
      });
      success = true;
      return res.json({ success, token, emailCode });
    } catch (error) {
      success = false;
      console.log(error);
      return res.status(500).json({ success: false, error });
    }
  }
);



// Login
router.post(
    "/login",
    [
      body("email", "Enter a valid email").isEmail(),
      body("password", "Password string cannot be blank").exists(),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      let success = false;
      if (!errors.isEmpty()) {
        return res.status(500).json({ success, errors: errors.array() });
      }
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          return res.status(500).json({
            success: false,
            error: "Please try to login with correct credentials",
          });
        }
  
        // Compare passwords
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          return res.status(400).json({
            success: false,
            error: "Please try to login with correct credentials",
          });
        }
  
        const data = {
          user: {
            id: user.id,
          },
        };
  
        // Generate authentication token
        const token = jwt.sign(data, process.env.JWT_SECRET);
  
        // Set the authentication token as an HTTP-only cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
        });
  
        success = true;
        return res.json({ success });
      } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal server error");
      }
    }
  );


  // Route for Email Verification
  // const jwt = require('jsonwebtoken');

  // const express = require('express');
  // const router = express.Router();
  // const jwt = require('jsonwebtoken');
  // const User = require('../models/User'); // Assuming you have a User model
  
// ... (other code) ...

router.post("/email/activation", async (req, res) => {
  try {
    const { emailCode } = req.body; // Assuming the JWT token is sent as "emailCode"
    console.log('Received emailCode:', emailCode);

    // Verify the JWT token using the secret
    const decoded = jwt.verify(emailCode, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);

    // Extract user ID from the decoded token
    const userId = decoded.user.id;
    console.log('User ID:', userId);

    // Find the user in the database by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: true, // Return success: true since the user is already verified
        msg: "User is already verified",
      });
    }

    // Update user's verification status
    user.isVerified = true;
    await user.save();

    // Respond with success message
    return res.json({
      success: true,
      msg: "Email Verified Successfully!!",
    });
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

// ... (other code) ...
  
  
  // module.exports = router;

// Route for Fetching user data after log-in    
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id; // Removed the extra 'S'
    const user = await User.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
