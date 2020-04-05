const User = require('../models/User');
const asyncMiddleware = require('../utils/asyncMiddleware');

const head = asyncMiddleware(async function head(req, res, next) {
  const { login } = req.query;
  if (!login) return next();
  const user = await User.findOne({ login });
  if (user) {
    res.status(200);
    res.end();
  } else {
    next();
  }
})

module.exports = {
  head
}