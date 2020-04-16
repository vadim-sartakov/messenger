const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  }
}, { timestamps: true });

const Message = model('Message', messageSchema);

module.exports = Message;