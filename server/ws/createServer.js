const url = require('url');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');
const { createServer } = require('http');
const { Server } = require('ws');
const jwt = require('jsonwebtoken');

let publicKey;
try {
  publicKey = fs.readFileSync(path.resolve(__dirname, '..', 'public.key'));
} catch(err) {}
const jwtSecret = process.env.JWT_SECRET;

const messageTypes = {
  POST_MESSAGE: 'post_message'
};

function createWsServer(app) {
  const server = createServer(app);
  const wss = new Server({ noServer: true, path: '/ws' });
  app.wss = wss;

  wss.on('connection', function(socket, req, user) {
    socket.id = user;
    socket.on('message', data => {
      const message = JSON.parse(data);
      switch (message.type) {
        case messageTypes.POST_MESSAGE:
          message.participants.forEach(participant => {
            if (participant._id !== user) {
              const curClient = Array.from(wss.clients).find(client => client.id === participant._id);
              if (curClient) curClient.send(JSON.stringify(message));
            }
          });
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
      decodedToken = jwt.verify(token, publicKey || jwtSecret);
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