const { Types } = require('mongoose');
const User = require('../models/User');
const Chat = require('../models/Chat');

async function populateArray(array, populate) {
  return array.reduce(async (prev, cur) => {
    const acc = await prev;
    const entry = await populate(cur);
    return [...acc, entry];
  }, Promise.resolve([]));
}

const root = {
  User: {
    chats: parent => Chat.find({ owner: parent._id })
  },
  Chat: {
    participants: async parent => {
      return populateArray(parent.participants, id => User.findById(id));
    }
  },
  Query: {
    chats: async (parent, args, context) => {
      const currentUserId = context.subject;
      const chats = await Chat.find({ owner: currentUserId });
      return chats || [];
    }
  },
  Mutation: {
    createChat: async (parent, { value }, context) => {
      const currentUserId = context.subject;
      let participants = value.participants.filter(cur => cur._id !== currentUserId);
      participants = [currentUserId, ...participants];
      const newChat = new Chat({ ...value, participants, owner: currentUserId });
      return await newChat.save();
    }
  }
};

module.exports = root;