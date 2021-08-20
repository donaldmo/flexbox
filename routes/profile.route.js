const express = require('express');
const router = express.Router();
const profileCtrl = require('../controllers/profile.controller')

router.get('/', profileCtrl.getProfile)

module.exports = router