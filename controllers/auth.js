const User = require("../models/User");
const StatusCodes = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  //const { name, email, password } = req.body;
  //if (!name || !email || !password) {
  //throw new BadRequestError("Please provide name, email and password");
  //}
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.getName() }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  // Find the user with the provided email
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Email is not registered");
  }
  // Compare the password
  const isCorrectPassword = await user.checkPassword(password);
  if (!isCorrectPassword) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.getName() }, token });
};

module.exports = { register, login };
