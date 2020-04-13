const path = require('path');
const fs = require('fs');
const jwt = require('express-jwt');

let publicKey;
try {
  publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));
} catch(err) {}
const jwtSecret = process.env.JWT_SECRET;
const auth = jwt({ secret: publicKey || jwtSecret });

module.exports = auth;