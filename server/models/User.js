const { Schema, model } = require('mongoose');
const ms = require('ms');
const color = require('./color');
const { userExpiresIn } = require('../config');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  color,
  expiresAt: {
    type: Date,
    required: true,
    index: true,
    default: () => {
      const endMs = new Date().getTime() + ms(userExpiresIn);
      return new Date(endMs);
    }
  }
}, { timestamps: true });

const User = model('User', userSchema);

module.exports = User;