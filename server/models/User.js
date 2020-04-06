const { Schema, model } = require('mongoose');
const colors = require('./colors');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  colors
});

const User = model('User', userSchema);

module.exports = User;