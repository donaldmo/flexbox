const Joi = require('@hapi/joi');

module.exports.authSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required()
});

module.exports.workspaceSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  author: Joi.object()
});

module.exports.gradeSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  author: Joi.object()
});

module.exports.registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
});

module.exports.emailSchema = Joi.object({
  email: Joi.string().email().lowercase().required()
});