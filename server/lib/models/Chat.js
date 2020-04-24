const { Schema, model } = require('mongoose');
const color = require('./color');

const participantSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  call: Boolean
}, { _id: false });

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
  participants: [participantSchema],
  color,
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

const Chat = model('Chat', chatSchema);

module.exports = Chat;