const { ObjectId } = require('mongoose').Types;
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
    chats: parent => Chat.find({ owner: parent._id }),
    friends: parent => populateArray(parent.friends, id => User.findById(id))
  },
  Chat: {
    owner: parent => User.findById(parent.owner),
    participants: async parent => {
      return populateArray(parent.participants, id => User.findById(id));
    }
  },
  Query: {
    me: async (parent, args, context) => {
      const currentUserId = context.subject;
      const curUser = await User.findById(currentUserId);
      return curUser;
    }
  }
};

module.exports = root;