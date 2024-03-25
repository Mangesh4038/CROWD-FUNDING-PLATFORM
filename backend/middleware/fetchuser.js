const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const cookieParser = require('cookie-parser');
require('dotenv').config();

// const fetchuser = async (req, res, next) => {
//   const token = req.header("auth-token");
//   console.log("Token:", token); // Log the token value for debugging

//   if (!token) {
//     console.log("Token not found in request header");
//     return res.status(401).send({ error: "Please authenticate using a valid token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("Decoded token:", decoded);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     console.log("Error decoding token:", error);
//     return res.status(401).send({ error: "Please authenticate using a valid token" });
//   }
// };
const fetchuser = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token:", token); // Log the token value for debugging
  
    if (!token) {
      return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (error) {
      return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
  };
module.exports = fetchuser;