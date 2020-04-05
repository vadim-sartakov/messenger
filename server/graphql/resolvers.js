const { ObjectId } = require('mongoose').Types;
const User = require('../models/User');
const Chat = require('../models/Chat');

const root = {
  Chat: {
    owner: parent => User.findById(parent.owner),
    participants: async parent => {
      return parent.participants.reduce(async (prev, cur) => {
        const acc = await prev;
        const user = await User.findById(cur);
        return [...acc, user];
      }, Promise.resolve([]));
    }
  },
  Query: {
    chats: async (parent, args, context) => {
      const currentUserId = context.subject;      
      const chats = await Chat.find({ 'owner': new ObjectId(currentUserId) });
      return chats;
    },
    friends: async (parent, args, context) => {
      const currentUserId = context.subject;
      const curUser = await User.findById(currentUserId);
      return curUser.friends;
    }
  }
};

module.exports = root;