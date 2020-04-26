const { GraphQLError } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const getRandomString = require('../utils/getRandomString');
const sendToChatParticipants = require('../utils/sendToChatParticipants');

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
      return populateArray(parent.participants, async participant => {
        const user = await User.findById(participant.user._id);
        return {
          ...participant,
          user
        }
      });
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
        $or: [{ owner: currentUserId }, { 'participants.user': currentUserId }]
      });
      return chats;
    }
  },
  Mutation: {
    createChat: async (parent, { name }, req) => {
      const currentUserId = req.user.subject;
      let inviteLink;
      while(true) {
        inviteLink = getRandomString(7);
        if (!await Chat.findOne({ inviteLink })) break;
      }
      const newChat = new Chat({ name, inviteLink, owner: currentUserId, participants: [{ user: currentUserId }] });
      return await newChat.save();
    },
    renameChat: async (parent, { id, name }, req) => {
      const currentUserId = req.user.subject;
      const chat = await Chat.findOne({ _id: id, owner: currentUserId });
      if (!chat) throw new GraphQLError('Only owner can change chat');
      chat.name = name;
      await chat.save();
      sendToChatParticipants(req.app.wss, currentUserId, chat, () => ({ type: 'chat_renamed', chatId: chat._id, name }));
      return;
    },
    joinChat: async (parent, { inviteLink }, req) => {
      // TODO: protect from bruteforce
      const currentUserId = req.user.subject;
      const currentUser = await User.findById(currentUserId, 'name color');
      const chat = await Chat.findOne({ inviteLink });
      if (!chat) throw new GraphQLError('Invalid link');
      chat.participants = [...(chat.participants || []), { user: currentUserId }];
      await chat.save();
      await chat.populate('participants.user').execPopulate();
      sendToChatParticipants(req.app.wss, currentUserId, chat, () => ({ type: 'joined_chat', chatId: chat._id, participant: { user: currentUser } }));
      return chat;
    },
    postMessage: async (parent, { chatId, text }, req) => {
      const currentUserId = req.user.subject;
      const chat = await Chat.findOne({ _id: chatId, 'participants.user': { $in: currentUserId } });
      if (!chat) throw new GraphQLError('Invalid chat id');
      const message = new Message({ author: currentUserId, content: text, chat: chatId });
      await message.save();
      await message.populate('author').execPopulate();
      sendToChatParticipants(req.app.wss, currentUserId, chat, () => ({ type: 'message_posted', chatId: chat._id, message }));
      return message;
    }
  }
};

module.exports = root;