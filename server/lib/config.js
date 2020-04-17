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
    throw new Error('No JWT_SECRET variable set');
  }
}

if (!process.env.MONGODB_URI) throw new Error('No MONGODB_URI variable set');

module.exports = {
  port: process.env.PORT || 8080,
  dbUrl: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN,
  jwtPrivateKey,
  jwtPublicKey,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  userExpiresIn: process.env.USER_EXPIRES_IN || '24h',
  cleanupPeriod: process.env.CLEANUP_PERIOD || '1h',
  clientPingInterval: process.env.CLIENT_PING_INTERVAL || '15s',
  clientConnectionTimeout: process.env.CLIENT_CONNECTION_TIMEOUT || '10s'
}