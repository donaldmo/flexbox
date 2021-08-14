const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { emailSchema } = require('../helpers/validation_schema');

module.exports = {
  generatePassword: async (password) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    }
    catch (error) {
      next(error);
    }
  },

  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;

      const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXP,
        issuer: 'pickurpage.com',
        audience: userId
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }

        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers['authorization']) {
      return next(createError.Unauthorized());
    }

    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized());
        else return next(createError.Unauthorized(err.message));
      }

      req.payload = payload;
      next();
    });
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;

      const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXP,
        issuer: 'pickurpage.com',
        audience: userId
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }

        resolve(token);
      });
    });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, payload) => {
        if (error) return reject(createError.Unauthorized);
        const userId = payload.aud;

        resolve(userId);
      });
    });
  },

  generateConfirmToken: (email) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.CONFIRM_TOKEN_SECRET;

      const options = {
        expiresIn: process.env.CONFIRM_TOKEN_EXP,
        issuer: 'pickurpage.com',
        audience: email
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }

        resolve(token);
      });
    });
  },

  verifyConfirmToken: async (req, res, next) => {
    try {
      if (!req.query.token) {
        return next(createError.BadRequest('Confirm token is required.'));
      }
  
      const token = req.query.token;
  
      JWT.verify(token, process.env.CONFIRM_TOKEN_SECRET, async (err, payload) => {
        if (err) {
          if (err.name === 'JsonWebTokenError') return next(createError.Unauthorized());
          else return next(createError.Unauthorized(err.message));
        }

        req.payload = payload;
        next();
      });
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  
  generateResetToken: (email) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.RESET_TOKEN_SECRET;

      const options = {
        expiresIn: process.env.RESET_TOKEN_EXP,
        issuer: 'pickurpage.com',
        audience: email
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }

        resolve(token);
      });
    });
  },


  verifyResetToken: async (req, res, next) => {
    try {
      if (!req.body.token) {
        return next(createError.BadRequest('Confirm token is required.'));
      }
  
      const token = req.query.token || req.body.token;
  
      JWT.verify(token, process.env.RESET_TOKEN_SECRET, async (err, payload) => {
        if (err) {
          if (err.name === 'JsonWebTokenError') { 
            return next(createError.BadRequest('Invalid reset token'));
          }
          else return next(createError.Unauthorized(err.message));
        }

        req.payload = payload;
        next();
      });
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
  
  generateInviteToken: (workspaceId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.INVITE_TOKEN_SECRET;

      const options = {
        expiresIn: process.env.INVITE_TOKEN_EXP,
        issuer: 'pickurpage.com',
        audience: workspaceId
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }

        resolve(token);
      });
    });
  },

  verifyInviteToken: async (req, res, next) => {
    try {
      if (!req.query.token) {
        return next(createError.BadRequest('Invite token is required.'));
      }
  
      const token = req.query.token || req.body.token;
      console.log('verifyInviteToken: token::', token)
  
      JWT.verify(token, process.env.INVITE_TOKEN_SECRET, async (err, payload) => {
        if (err) {
          if (err.name === 'JsonWebTokenError') { 
            return next(createError.BadRequest('Invalid reset token'));
          }
          else return next(createError.Unauthorized(err.message));
        }

        req.payload = payload;
        next();
      });
    }
    catch (error) {
      if (error.isJoi === true) error.status = 422;
      next(error);
    }
  },
}