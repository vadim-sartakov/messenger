const jwt = require('express-jwt');
const { publicKey } = require('../constants/jwt');

const auth = jwt({ secret: publicKey });

module.exports = auth;