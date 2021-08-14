const createError = require('http-errors');
const ms = require('ms');
const User = require('../models/user.model');
const { authSchema, emailSchema } = require('../helpers/validation_schema');
const { pagenate } = require('../helpers/pagenate');

const {
  generatePassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  generateConfirmToken,
  generateResetToken
} = require('../helpers/jwt_helper');

const sendEmail = require('../helpers/send_email');

exports.register = async (req, res, next) => {
  try {
    console.log('user.controller.js::register: body: ', req.body)
    const hashedPassword = await generatePassword(req.body.password);
    // console.log('hashedPassword: ', hashedPassword)

    const result = await authSchema.validateAsync({ email: req.body.email, password: hashedPassword });
    const doesExist = await User.findOne({ email: result.email });
    if (doesExist) throw createError.Conflict(`${result.email} is already registered`);

    if (req.body.firstName && req.body.lastName) {
      result.firstName = req.body.firstName.trim();
      result.lastName = req.body.lastName.trim();
    }

    if (req.body.role && req.body.role !== '') result.role = req.body.role;

    const user = new User(result);
    const savedUser = await user.save();

    const accessToken = await signAccessToken(savedUser.id);
    const rereshToken = await signRefreshToken(savedUser.id);
    const confirmToken = await generateConfirmToken(result.email);

    sendEmail.registerEmail({
      username: req.body.email,
      confirmToken: confirmToken,
      email: result.email
    });

    res.cookie(process.env.SESSION_NAME, accessToken, {
      httpOnly: true,
      maxAge: ms(process.env.SESSION_LIFETIME) * 1000
    });

    res.send({ accessToken, rereshToken });
  }
  catch (error) {
    console.log(error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

exports.login = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createError.NotFound('User not registered');

    const isMatch = await user.isValidPassword(result.password);
    if (!isMatch) throw createError.Unauthorized('Invalid username/password');

    const accessToken = await signAccessToken(user.id);
    const rereshToken = await signRefreshToken(user.id);

    res.cookie(process.env.SESSION_NAME, accessToken, {
      httpOnly: true,
      maxAge: ms(process.env.SESSION_LIFETIME) * 1000
    });

    res.send({ accessToken, rereshToken });
  }
  catch (error) {
    if (error.isJoi === true) {
      return next(createError.BadRequest('Invalid username/password'));
    }

    next(error);
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    if (!req.body.refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(req.body.refreshToken);

    const accessToken = await signAccessToken(userId);
    const refreshToken = await signRefreshToken(userId);

    res.send({ accessToken, refreshToken });
  }

  catch (error) {
    // console.log(error)
    next(error.message);
  }
}

exports.confirmEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.payload.aud });
    // console.log(req.payload)
    if (!user) throw createError.NotFound('User not registered');
    if (user.confirmedEmail === true) throw createError.BadRequest('Email already confirmed');

    user.confirmedEmail = true;

    console.log(user)

    const confirmUser = await user.save();
    if (!confirmUser) throw createError.NotFound('User not registered');

    res.send({ message: 'Email verified successfuly' });
  }
  catch (error) {
    // console.log(error)
    next(error);
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    // console.log(req.body);
    const result = await emailSchema.validateAsync({ email: req.body.email, });
    const doesExist = await User.findOneAndUpdate({ email: result.email }, {
      resetPassword: true
    });

    if (!doesExist) throw createError.NotFound();
    const resetToken = await generateResetToken(result.email);

    sendEmail.forgotPassword({
      resetToken: resetToken,
      email: result.email
    });

    res.send({ resetToken });
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
    // console.log(error);
  }
}

exports.resetPassword = async (req, res, next) => {
  try {
    const user = new User();
    const newPassword = await user.generatePassword(req.body.password);

    const resetPassword = await User.updateOne({
      email: req.payload.aud,
      resetPassword: true
    },
      {
        resetPassword: false,
        password: newPassword
      });

    if (resetPassword.nModified === 0) {
      throw createError.BadRequest('Reset Password Failed');
    }

    res.send(resetPassword);
  }
  catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

// for testing only
exports.sendEmail = async (req, res, next) => {
  const data = {
    username: req.body.username,
    email: req.body.email,
    confirmToken: 'd9729feb74992cc3482b350163a1a010'
  }

  sendEmail.registerEmail(data);
  res.send('ok')
}