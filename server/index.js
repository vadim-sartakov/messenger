require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const { head: usersHead } = require('./middlewares/users');

const prefix = '/api';

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, err => {
  if (err) console.log(`Failed to connect to database ${process.env.DB_URL}`)
  else console.log(`Successfully connected to database ${process.env.DB_URL}`)
});

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.head(`${prefix}/users`, usersHead);
app.use(`${prefix}/login`, login);

app.listen(port, () => {
  console.log(`Application started at port ${port}`);
});