function login(req, res) {
  const { username } = req.body;
  res.json({
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user: { id: 0, username }
  });
}

module.exports = login;