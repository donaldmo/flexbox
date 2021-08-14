const crypto = require('crypto');
const ms = require('ms')

const ACCESS_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const REFRESH_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const SESSION_SECRET = crypto.randomBytes(32).toString('hex');
const CONFIRM_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');
const RESET_TOKEN_SECRET = crypto.randomBytes(32).toString('hex');

console.table({ 
  ACCESS_TOKEN_SECRET, 
  REFRESH_TOKEN_SECRET, 
  SESSION_SECRET, 
  CONFIRM_TOKEN_SECRET, 
  RESET_TOKEN_SECRET 
});

// // 3hrs
// const maxAge = 3 * 24 * 60 * 60;

// const time = ms('3d')
// console.log('time: ', time, ' maxAge: ', maxAge * 1000);
