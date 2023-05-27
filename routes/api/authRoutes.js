const express = require("express");

const { validateBody } = require("../../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../../schemas/authSchema");
const { register, login, logout } = require("../../controllers/authControllers");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", logout);

module.exports = {
  authRouter: router,
};
