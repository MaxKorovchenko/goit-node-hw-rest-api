const Joi = require("joi");

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
    .required(),
});

module.exports = {
  contactAddSchema,
};
