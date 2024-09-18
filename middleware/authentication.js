const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("Authorization Header is not set");
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new UnauthenticatedError("Token not provided");
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user to the job routes
    //const user = User.findById(payload.id).select("-password");
    //req.user = user;

    req.user = { userId: payload.userId, name: payload.name };
    next();
  } catch {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
