const express = require("express");

const { validateBody } = require("../../middlewares/validateBody");
const { registerSchema } = require("../../schemas/authSchema");
const { register } = require("../../controllers/authControllers");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

module.exports = {
  authRouter: router,
};
