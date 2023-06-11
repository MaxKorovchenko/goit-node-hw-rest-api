const Joi = require('joi');

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegex).required(),
  password: Joi.string().min(6).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business'),
});

module.exports = {
  registerSchema,
  emailSchema,
  loginSchema,
  updateSubscriptionSchema,
};
