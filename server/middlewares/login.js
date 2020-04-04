const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

const login = asyncMiddleware(async (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  await user.save();
  res.json({
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user
  });
})

module.exports = login;