const { Schema, model } = require('mongoose');
const color = require('./color');

const chatSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  inviteLink: {
    type: String,
    required: true,
    index: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  color,
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
});

const Chat = model('Chat', chatSchema);

module.exports = Chat;