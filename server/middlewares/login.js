const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');
const { jwtPrivateKey, jwtPublicKey, jwtExpiresIn } = require('../constants/config');

const jwtSignAsync = promisify(jwt.sign);

const login = asyncMiddleware(async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  const token = await jwtSignAsync(
    {
      subject: user._id
    },
    jwtPrivateKey || jwtPublicKey,
    {
      ...jwtPrivateKey && { algorithm: 'RS256' },
      expiresIn: jwtExpiresIn
    }
  );
  res.json({ token });
})

module.exports = login;