const { v4: uuidv4 } = require('uuid');
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
    me: async (parent, args, req) => {
      const currentUserId = req.user.subject;
      const currentUser = await User.findById(currentUserId);
      return currentUser;
    }
  },
  Mutation: {
    createChat: async (parent, { value }, req) => {
      const currentUserId = req.user.subject;
      const inviteLink = req.protocol + '://' + req.get('host') + '/' + uuidv4()
      const newChat = new Chat({ ...value, inviteLink, owner: currentUserId });
      return await newChat.save();
    }
  }
};

module.exports = root;