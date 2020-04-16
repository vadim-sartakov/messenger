const jwt = require('express-jwt');
const { jwtPublicKey } = require('../config');

const auth = jwt({ secret: jwtPublicKey });

module.exports = auth;