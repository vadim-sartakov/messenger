function findWsClient(wssClients, id) {
  return Array.from(wssClients).find(client => {
    return client.id === id;
  });
}

module.exports = findWsClient;