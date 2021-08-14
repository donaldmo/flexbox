const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller')
const { verifyAccessToken } = require('../helpers/jwt_helper')

router.get('/', verifyAccessToken, profileCtrl.viewProfile)

module.exports = router