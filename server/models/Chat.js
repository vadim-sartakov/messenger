const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

const Chat = model('Chat', chatSchema);

module.exports = Chat;