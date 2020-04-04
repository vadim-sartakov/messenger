const Model = require('./Model');
const getRandomInt = require('../utils/getRandomInt');
const colors = require('../constants/colors');

class User extends Model {
  constructor({ username }) {
    super();
    const { color, textColor } = colors[getRandomInt(0, colors.length - 1)];
    this.username = username;
    this.color = color;
    this.textColor = textColor;
  }
}

module.exports = User;