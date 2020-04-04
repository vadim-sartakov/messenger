const fs = require('fs');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

const privateKey = fs.readFileSync('./private.key');
const jwtSignAsync = promisify(jwt.sign);

const login = asyncMiddleware(async (req, res) => {
  const { username } = req.body;

  const user = new User({ username });
  await user.save();

  const token = await jwtSignAsync(
    {
      subject: {
        id: user.id,
        username: user.username
      }
    },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: '2h'
    }
  );

  res.json({
    token,
    user
  });
})

module.exports = login;