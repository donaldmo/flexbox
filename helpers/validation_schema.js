const Joi = require('@hapi/joi');

module.exports.authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

module.exports.emailSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});