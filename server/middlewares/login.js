const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { privateKey, publicKey, expiresIn } = require('../constants/jwt');

const jwtSignAsync = promisify(jwt.sign);

const login = asyncMiddleware(async (req, res) => {
  const { name } = req.body;
  let user = new User({ name });
  user = await user.save();
  const token = await jwtSignAsync(
    {
      subject: user._id
    },
    privateKey || publicKey,
    {
      ...privateKey && { algorithm: 'RS256' },
      expiresIn
    }
  );
  res.json({ token });
})

module.exports = login;