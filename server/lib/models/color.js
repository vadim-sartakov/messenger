const getRandomInt = require('../utils/getRandomInt');
const colors = require('../constants/colors');

module.exports = {
  type: String,
  required: true,
  default: () => colors[getRandomInt(0, colors.length - 1)]
};