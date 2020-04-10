const path = require('path');
const fs = require('fs');
const jwt = require('express-jwt');

const publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));
const auth = jwt({ secret: publicKey });

module.exports = auth;