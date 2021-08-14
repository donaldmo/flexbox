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

exports.viewProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.payload.aud })

    res.send({ data: user });
  }
  catch (error) {
    console.log('viewProfile: ', error)
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}