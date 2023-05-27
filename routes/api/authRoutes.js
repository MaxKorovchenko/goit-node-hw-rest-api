const express = require("express");

const { validateBody } = require("../../middlewares/validateBody");
const { registerSchema, loginSchema, updateSubscriptionSchema } = require("../../schemas/authSchema");
const { register, login, logout, getCurrentUser, updateSubscription } = require("../../controllers/authControllers");
const { authenticate } = require("../../middlewares/authenticate");

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, getCurrentUser);

router.patch("/", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

module.exports = {
  authRouter: router,
};
