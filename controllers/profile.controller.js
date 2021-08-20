const createError = require('http-errors');
const User = require('../models/user.model');
const { 
  authSchema, emailSchema, organisationSchema 
} = require('../helpers/validation_schema');
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

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.payload.aud })

    res.send(user);
  }
  catch (error) {
    console.log('getProfile: ', error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}