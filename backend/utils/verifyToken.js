const jwt = require("jsonwebtoken");
const { createError } = require("../utils/error.js");

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      // Handle JWT verification error
      return next(createError(403, "Token is not valid!"));
    }
    req.user = user;
    next(); // Call next() to move to the next middleware
  });
};

const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.id === req.params.id || req.user.isAdmin)) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next(); // Call next() if user is an admin
    } else {
      const err = new Error("You are not authorized!");
      err.status = 403;
      return next(err);
    }
  });
};


module.exports = { verifyToken, verifyUser, verifyAdmin };
