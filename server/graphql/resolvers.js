const { v4: uuidv4 } = require('uuid');
const { GraphQLError } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

async function populateArray(array, populate) {
  return array.reduce(async (prev, cur) => {
    const acc = await prev;
    const entry = await populate(cur);
    return [...acc, entry];
  }, Promise.resolve([]));
}

const root = {
  Date: GraphQLDateTime,
  Chat: {
    participants: async parent => {
      return populateArray(parent.participants, id => User.findById(id));
    },
    messages: async (parent, { limit }) => {
      let query = Message.find({ chat: parent._id }).sort({ 'createdAt': 1 });
      if (limit) query = query.limit(limit);
      return query.exec();
    }
  },
  Message: {
    author: async parent => User.findById(parent.author)
  },
  Query: {
    me: async (parent, args, req) => {
      const currentUserId = req.user.subject;
      const currentUser = await User.findById(currentUserId);
      return currentUser;
    },
    getChats: async (parent, args, req) => {
      const currentUserId = req.user.subject;
      const chats = await Chat.find({
        $or: [{ owner: currentUserId }, { 'participants': currentUserId }]
      });
      return chats;
    },
    getChat: async (parent, { id }, req) => {
      const currentUserId = req.user.subject;
      const chats = await Chat.findOne({
        _id: id,
        $or: [{ owner: currentUserId }, { 'participants': currentUserId }]
      });
      return chats;
    }
  },
  Mutation: {
    createChat: async (parent, { value }, req) => {
      const currentUserId = req.user.subject;
      const inviteLink = uuidv4();
      const newChat = new Chat({ ...value, inviteLink, owner: currentUserId });
      return await newChat.save();
    },
    joinChat: async (parent, { inviteLink }, req) => {
      // TODO: protect from bruteforce
      const currentUserId = req.user.subject;
      const chat = await Chat.findOne({ inviteLink });
      if (!chat) throw new GraphQLError('Invalid id');
      chat.participants = [...(chat.participants || []), currentUserId];
      return await chat.save();
    },
    postMessage: async (parent, { chat, content }, req) => {
      const currentUserId = req.user.subject;
      const message = new Message({ author: currentUserId, content, chat });
      return await message.save();
    }
  }
};

module.exports = root;