const jwt = require('express-jwt');
const { jwtPublicKey } = require('../constants/config');

const auth = jwt({ secret: jwtPublicKey });

module.exports = auth;