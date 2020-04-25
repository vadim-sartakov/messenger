const url = require('url');
const querystring = require('querystring');
const ms = require('ms');
const { createServer } = require('http');
const { Server } = require('ws');
const jwt = require('jsonwebtoken');
const { jwtPublicKey, clientPingInterval, clientConnectionTimeout } = require('../config');
const Chat = require('../models/Chat');
const findWsClient = require('../utils/findWsClient');

const messageTypes = {
  CALL_OFFER: 'call_offer',
  CALL_OFFER_ERROR: 'call_offer_error',
  CALL_ANSWER: 'call_answer',
  CALL_ANSWER_ERROR: 'call_answer_error',
  ICE_CANDIDATE: 'ice_candidate'
};

async function handleCallOffer({ wss, socket, chat, recipient, offer }) {
  const recipientWsClient = findWsClient(wss.clients, recipient);
  const curChat = await Chat.find({ _id: chat, 'participants.user': recipient });
  if (!curChat) {
    socket.send(JSON.stringify({ type: messageTypes.CALL_OFFER_ERROR, message: 'Chat not found' }));
    return;
  }
  if (!recipientWsClient) {
    socket.send(JSON.stringify({ type: messageTypes.CALL_OFFER_ERROR, message: 'Recipient is not available' }));
    return;
  }
  recipientWsClient.send(JSON.stringify({ type: messageTypes.CALL_OFFER, chat, sender: socket.id, offer }));
}

async function handleCallAnswer({ wss, socket, chat, recipient, answer }) {
  const recipientWsClient = findWsClient(wss.clients, recipient);
  if (!recipientWsClient) {
    socket.send(JSON.stringify({ type: messageTypes.CALL_ANSWER_ERROR, message: 'Recipient is not available' }));
    return;
  }
  recipientWsClient.send(JSON.stringify({ type: messageTypes.CALL_ANSWER, chat, sender: socket.id, answer }));
}

async function handleIceCandidate({ wss, socket, chat, recipient, candidate }) {
  const recipientWsClient = findWsClient(wss.clients, recipient);
  recipientWsClient.send(JSON.stringify({ type: messageTypes.ICE_CANDIDATE, chat, sender: socket.id, candidate }));
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
        case messageTypes.CALL_OFFER:
          handleCallOffer({
            socket,
            wss,
            chat: message.chat,
            recipient: message.recipient,
            offer: message.offer
          });
          break;
        case messageTypes.CALL_ANSWER:
          handleCallAnswer({
            socket,
            wss,
            chat: message.chat,
            recipient: message.recipient,
            answer: message.answer
          });
          break;
        case messageTypes.ICE_CANDIDATE:
          handleIceCandidate({
            socket,
            wss,
            chat: message.chat,
            recipient: message.recipient,
            candidate: message.candidate
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