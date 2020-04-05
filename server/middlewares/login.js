const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

const privateKey = fs.readFileSync(path.resolve(__dirname, '..', 'private.key'));
const jwtSignAsync = promisify(jwt.sign);

const login = asyncMiddleware(async (req, res) => {
  const { name, login } = req.body;

  const user = new User({ name, login });
  await user.save();

  const token = await jwtSignAsync(
    {
      subject: user._id
    },
    privateKey,
    {
      algorithm: 'RS256',
      expiresIn: '4h'
    }
  );

  res.json({
    token,
    user
  });
})

module.exports = login;