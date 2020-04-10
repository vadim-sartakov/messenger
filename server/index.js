require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwtAuth = require('./middlewares/auth');
const login = require('./middlewares/login');
const graphqlServer = require('./graphql/server');
const createWsServer = require('./ws/createServer');
const port = process.env.PORT || 8080;
const apiPrefix = '/api';

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, err => {
  if (err) console.log(`Failed to connect to database ${process.env.DB_URL}`)
  else console.log(`Successfully connected to database ${process.env.DB_URL}`)
});

const app = express();

app.use(cors({ origin: process.env.WEB_APP_URL }));

app.use(bodyParser.json());
app.post(`${apiPrefix}/login`, login);

app.use(jwtAuth.unless({ path: ['/ws'] }));
graphqlServer.applyMiddleware({ app, path: '/graphql' });

const wsServer = createWsServer(app);

wsServer.listen(port, () => {
  console.log(`Server started on port ${port}`);
});