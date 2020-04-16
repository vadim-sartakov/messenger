const fs = require('fs');
const path = require('path');
const debug = require('debug')('jwt');

let jwtPrivateKey, jwtPublicKey;
try {
  jwtPrivateKey = fs.readFileSync(path.resolve(__dirname, '..', 'private.key'));
  jwtPublicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));
} catch (err) {
  debug('No key pair detected. Fallback to plain string secret');
  jwtPublicKey = process.env.JWT_SECRET;
  if (!process.env.JWT_SECRET) {
    debug('No JWT_SECRET env variable provided. Shutting down.');
    throw new Error('No JWT_SECRET value set');
  }
}

if (!process.env.JWT_EXPIRES_IN) throw new Error('No JWT_EXPIRES_IN value set')

module.exports = {
  jwtPrivateKey,
  jwtPublicKey,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN
}