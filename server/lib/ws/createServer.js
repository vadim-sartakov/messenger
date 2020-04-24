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

async function handleCallOffer({ wss, chatId, callerId, calleeId, offer }) {
  const callerWsClient = findWsClient(wss.clients, callerId);
  const calleeWsClient = findWsClient(wss.clients, calleeId);
  const curChat = await Chat.find({ _id: chatId, 'participants.user': callerId });
  if (!curChat) {
    callerWsClient.send(JSON.stringify({ type: messageTypes.CALL_OFFER_ERROR, message: 'Chat not found' }));
    return;
  }
  if (!calleeWsClient) {
    callerWsClient.send(JSON.stringify({ type: messageTypes.CALL_OFFER_ERROR, message: 'Callee is not available' }));
    return;
  }
  calleeWsClient.send(JSON.stringify({ type: messageTypes.CALL_OFFER, chatId, callerId, calleeId, offer }));
}

async function handleCallAnswer({ wss, chatId, callerId, calleeId, answer }) {
  const callerWsClient = findWsClient(wss.clients, callerId);
  const calleeWsClient = findWsClient(wss.clients, calleeId);
  if (!calleeWsClient) return;
  if (!callerWsClient) {
    calleeWsClient.send(JSON.stringify({ type: messageTypes.CALL_ANSWER_ERROR, message: 'Caller is not available' }));
    return;
  }
  callerWsClient.send(JSON.stringify({ type: messageTypes.CALL_ANSWER, chatId, callerId, calleeId, answer }));
}

async function handleIceCandidate({ wss, chatId, callerId, calleeId, candidate }) {
  const calleeWsClient = findWsClient(wss.clients, calleeId);
  calleeWsClient.send(JSON.stringify({ type: messageTypes.ICE_CANDIDATE, chatId, calleeId, callerId, candidate }));
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
            wss,
            chatId: message.chatId,
            callerId: socket.id,
            calleeId: message.calleeId,
            offer: message.offer
          });
          break;
        case messageTypes.CALL_ANSWER:
          handleCallAnswer({
            wss,
            chatId: message.chatId,
            callerId: message.callerId,
            calleeId: socket.id,
            answer: message.answer
          });
          break;
        case messageTypes.ICE_CANDIDATE:
          handleIceCandidate({
            wss,
            chatId: message.chatId,
            callerId: socket.id,
            calleeId: message.calleeId,
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