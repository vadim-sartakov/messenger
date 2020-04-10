require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('ws');
const jwtAuth = require('./middlewares/auth');
const login = require('./middlewares/login');
const graphqlServer = require('./graphql/server');
const wsUpgrade = require('./ws/upgrade');
const wsConnection = require('./ws/connection');

const port = process.env.PORT || 8080;
const apiPrefix = '/api';

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, err => {
  if (err) console.log(`Failed to connect to database ${process.env.DB_URL}`)
  else console.log(`Successfully connected to database ${process.env.DB_URL}`)
});

const app = express();

app.use(bodyParser.json());
app.post(`${apiPrefix}/login`, login);

app.use(jwtAuth.unless({ path: ['/ws'] }));
graphqlServer.applyMiddleware({ app, path: '/graphql' });

const server = http.createServer(app);
const wss = new Server({ noServer: true, path: '/ws' });

server.on('upgrade', wsUpgrade(wss));
wss.on('connection', wsConnection);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});