const express = require("express");

const { validateBody } = require("../../middlewares/validateBody");
const { registerSchema, loginSchema } = require("../../schemas/authSchema");
const { register, login } = require("../../controllers/authControllers");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

module.exports = {
  authRouter: router,
};
