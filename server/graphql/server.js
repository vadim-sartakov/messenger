const fs = require('fs');
const path = require('path');
const { buildSchema } = require('graphql');
const graphqlServer = require('express-graphql');
const rootValue = require('./resolver');

const schema = buildSchema(fs.readFileSync(path.resolve(__dirname, './schema.gql'), { encoding: 'utf8' }));

const server = graphqlServer({
  schema,
  rootValue,
  graphiql: process.env === 'development'
});

module.exports = server;