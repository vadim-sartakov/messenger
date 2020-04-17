const url = require('url');
const querystring = require('querystring');
const ms = require('ms');
const { createServer } = require('http');
const { Server } = require('ws');
const { jwtPublicKey, clientPingInterval, clientConnectionTimeout } = require('../config');
const jwt = require('jsonwebtoken');

function createWsServer(app) {
  const server = createServer(app);
  const wss = new Server({ noServer: true, path: '/ws' });
  app.wss = wss;

  wss.on('connection', function(socket, req, user) {
    socket.id = user;
    let interval, timeout;
    interval = setInterval(function() {
      socket.send(JSON.stringify({ type: 'ping' }));
      socket.pingSent = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (socket.pingSent) socket.close();
      }, ms(clientConnectionTimeout));
    }, ms(clientPingInterval));

    socket.on('close', () => {
      clearInterval(interval);
    })

    socket.on('message', event => {
      const message = JSON.parse(event);
      switch (message.type) {
        case 'pong':
          delete socket.pingSent;
          break;
        default:
      }
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
      decodedToken = jwt.verify(token, jwtPublicKey);
    } catch(err) {
      socket.destroy();
      return;
    }
    
    wss.handleUpgrade(req, socket, head, function(ws) {
      wss.emit('connection', ws, req, decodedToken.subject);
    });
  });

  return server;
}

module.exports = createWsServer;