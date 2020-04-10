const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const { createServer } = require('http');
const { Server } = require('ws');
const jwt = require('jsonwebtoken');

const publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));

function createWsServer(app) {
  const server = createServer(app);
  const wss = new Server({ noServer: true, path: '/ws' });

  wss.on('connection', function(socket, req, user) {
    socket.on('message', (data) => {
      console.log('Received from %s data %o', user, data);
    });
  });

  server.on('upgrade', function upgrade(req, socket, head) {
    const { search } = url.parse(req.url);
    const { token } = search ? querystring.parse(search.replace('?', '')) : {};
    if (!token) {
      socket.destroy();
      return;
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, publicKey);
    } catch(err) {
      socket.destroy();
      return;
    }
    // TODO: Calculate when token expires and set socket.desctroy() timeout
    wss.handleUpgrade(req, socket, head, function(ws) {
      wss.emit('connection', ws, req, decodedToken.subject);
    });
  });

  return server;
}

module.exports = createWsServer;