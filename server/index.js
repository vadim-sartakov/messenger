require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const login = require('./routes/login');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use('/api/login', login);

app.listen(port, () => {
  console.log(`Application started at port ${port}`);
});