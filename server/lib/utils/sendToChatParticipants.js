const findWsClient = require('./findWsClient');

function sendToChatParticipants(wss, currentUserId, chat, callback) {
  (chat.participants || []).forEach(participant => {
    const client = findWsClient(wss.clients, participant.user.toString());
    if (!client || client.id === currentUserId) return;
    client.send(JSON.stringify(callback()));
  });
}

module.exports = sendToChatParticipants;