const { Schema, model } = require('mongoose');
const getRandomInt = require('../utils/getRandomInt');
const colors = require('../constants/colors');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  login: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  colors: {
    type: {
      background: String,
      text: String
    },
    required: true,
    default: () => colors[getRandomInt(0, colors.length - 1)]
  }
});

const User = model('User', userSchema);

module.exports = User;