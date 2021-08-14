/** Express router providing user authentication routes
 * @module routes/auth.route
 * @requires express
 */

/**
 * express module
 * @const
 */

const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const {verifyConfirmToken, verifyAccessToken, verifyResetToken} = require('../helpers/jwt_helper')

/**
 * POST route for registration
 * @name post/auth/register
 * @function
 * @memberof module:routes/auth.route~AuthRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/register', authCtrl.register);

/**
 * POST route for login
 * @name post/auth/login
 * @function
 * @memberof module:routes/auth.route~AuthRoute
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
router.post('/login', authCtrl.login);

router.post('/refresh-token', authCtrl.refreshToken);

router.delete('/logout', async (req, res, next) => {
  res.send('logout route');
});

router.get('/verify-email', verifyConfirmToken, authCtrl.confirmEmail);
router.post('/forgot-password', authCtrl.forgotPassword);
router.post('/reset-password', verifyResetToken, authCtrl.resetPassword);

// for testing sendign emails
router.post('/send-email', authCtrl.sendEmail);

module.exports = router;