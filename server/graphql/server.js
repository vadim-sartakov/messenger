const fs = require('fs');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync(path.resolve(__dirname, './schema.gql'), { encoding: 'utf8' });
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => req
});

module.exports = server;