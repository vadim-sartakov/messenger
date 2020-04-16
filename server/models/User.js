const { Schema, model } = require('mongoose');
const color = require('./color');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  color
}, { timestamps: true });

const User = model('User', userSchema);

module.exports = User;