const url = require('url');
const querystring = require('querystring');
const ms = require('ms');
const { createServer } = require('http');
const { Server } = require('ws');
const jwt = require('jsonwebtoken');
const { jwtPublicKey, clientPingInterval, clientConnectionTimeout } = require('../config');
const Chat = require('../models/Chat');
const findWsClient = require('../utils/findWsClient');

async function handleCallOffer({ wss, chatId, callerId, calleeId, offer }) {
  const callerWsClient = findWsClient(wss.clients, callerId);
  const calleeWsClient = findWsClient(wss.clients, calleeId);
  const curChat = await Chat.find({ _id: chatId, 'participants.user': callerId });
  if (!curChat) {
    callerWsClient.send(JSON.stringify({ type: 'call_offer_error', message: 'Chat not found' }));
    return;
  }
  if (!calleeWsClient) {
    callerWsClient.send(JSON.stringify({ type: 'call_offer_error-offer-error', message: 'Callee is not available' }));
    return;
  }
  calleeWsClient.send(JSON.stringify({ type: 'call_offer', chatId, callerId, offer }));
}

async function handleCallAnswer({ wss, chatId, callerId, calleeId, answer }) {
  const callerWsClient = findWsClient(wss.clients, callerId);
  const calleeWsClient = findWsClient(wss.clients, calleeId);
  if (!calleeWsClient) return;
  if (!callerWsClient) {
    calleeWsClient.send(JSON.stringify({ type: 'call_answer_error', message: 'Caller is not available' }));
    return;
  }
  callerWsClient.send(JSON.stringify({ type: 'call_answer', chatId, callerId, calleeId, answer }));
}

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
    });

    socket.on('message', event => {
      const message = JSON.parse(event);
      switch (message.type) {
        case 'call_offer':
          handleCallOffer({
            wss,
            chatId: message.chatId,
            callerId: socket.id,
            calleeId: message.calleeId,
            offer: message.offer
          });
          break;
        case 'call_answer':
          handleCallAnswer({
            wss,
            chatId: message.chatId,
            callerId: message.callerId,
            calleeId: socket.id,
            answer: message.answer
          });
          break;
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