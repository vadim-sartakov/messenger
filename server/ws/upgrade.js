const url = require('url');
const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));

const upgrade = wss => (req, socket, head) => {
  const { search } = url.parse(req.url);
  const { token } = search ? querystring.parse(search.replace('?', '')) : {};
  if (!token) {
    socket.destroy();
    return;
  }
  try {
    jwt.verify(token, publicKey);
  } catch(err) {
    socket.destroy();
    return;
  }
  wss.handleUpgrade(req, socket, head, function(ws) {
    wss.emit('connection', ws, req);
  });
}

module.exports = upgrade;