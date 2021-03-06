const { GraphQLError } = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const getRandomString = require('../utils/getRandomString');

async function populateArray(array, populate) {
  return array.reduce(async (prev, cur) => {
    const acc = await prev;
    const entry = await populate(cur);
    return [...acc, entry];
  }, Promise.resolve([]));
}

function findWsClient(wssClients, id) {
  return Array.from(wssClients).find(client => {
    return client.id === id;
  });
}

function sendToChatParticipants(req, chat, callback) {
  const currentUserId = req.user.subject;
  const { wss } = req.app;
  (chat.participants || []).forEach(participant => {
    const client = findWsClient(wss.clients, participant.toString());
    if (!client || client.id === currentUserId) return;
    client.send(JSON.stringify(callback()));
  });
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
        $or: [{ owner: currentUserId }, { participants: currentUserId }]
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
      const newChat = new Chat({ name, inviteLink, owner: currentUserId, participants: [currentUserId] });
      return await newChat.save();
    },
    renameChat: async (parent, { id, name }, req) => {
      const currentUserId = req.user.subject;
      const chat = await Chat.findOne({ _id: id, owner: currentUserId });
      if (!chat) throw new GraphQLError('Only owner can change chat');
      chat.name = name;
      await chat.save();
      sendToChatParticipants(req, chat, () => ({ type: 'chat_renamed', chatId: chat._id, name }));
      return;
    },
    joinChat: async (parent, { inviteLink }, req) => {
      // TODO: protect from bruteforce
      const currentUserId = req.user.subject;
      const currentUser = await User.findById(currentUserId, 'name color');
      const chat = await Chat.findOne({ inviteLink });
      if (!chat) throw new GraphQLError('Invalid link');
      chat.participants = [...(chat.participants || []), currentUserId];
      await chat.save()
      sendToChatParticipants(req, chat, () => ({ type: 'joined_chat', chatId: chat._id, participant: currentUser }));
      return chat;
    },
    postMessage: async (parent, { chatId, text }, req) => {
      const currentUserId = req.user.subject;
      const chat = await Chat.findOne({ _id: chatId, participants: { $in: currentUserId } });
      if (!chat) throw new GraphQLError('Invalid chat id');
      const message = new Message({ author: currentUserId, content: text, chat: chatId });
      await message.save();
      await message.populate('author').execPopulate();
      sendToChatParticipants(req, chat, () => ({ type: 'message_posted', chatId: chat._id, message }));
      return message;
    }
  }
};

module.exports = root;