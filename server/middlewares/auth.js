const path = require('path');
const fs = require('fs');
const jwt = require('express-jwt');

const publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));
const auth = jwt({
  secret: publicKey,
  getToken: req => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

module.exports = auth;