const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers/HttpError");
const { controllerWrapper } = require("../helpers/controllerWrapper");
const { User } = require("../models/user");

const register = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, "Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
});

const login = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw new HttpError(401, "Email or password invalid");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "22h" });

  res.json({ token });
});

const logout = controllerWrapper(async (req, res) => {});

const getCurrentUser = controllerWrapper(async (req, res) => {});

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
