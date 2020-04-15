const { Query, Mutation } = require('./resolvers');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const getRandomString = require('../utils/getRandomString');

jest.mock('../utils/getRandomString');
jest.mock('../models/User');
jest.mock('../models/Chat');
jest.mock('../models/Message');

describe('graphql resolvers', () => {
  const req = {
    app: {
      wss: {
        clients: [{
          id: '0',
          send: jest.fn()
        }, {
          id: '1',
          send: jest.fn()
        }]
      }
    },
    user: { subject: '0' }
  };

  beforeEach(() => {
    getRandomString.mockReset();
    User.mockReset();
    Chat.mockReset();
    req.app.wss.clients[0].send.mockReset();
    req.app.wss.clients[1].send.mockReset();
  });

  it('me', async () => {
    const userInstance = { _id: 0, name: 'User' };
    User.findById.mockReturnValueOnce(userInstance);
    const result = await Query.me(undefined, undefined, req);
    expect(result).toEqual(userInstance);
  });

  it('getChats', async () => {
    const chatInstances = [{ _id: 0, name: 'Chat' }];
    Chat.find.mockReturnValueOnce(chatInstances);
    const result = await Query.getChats(undefined, undefined, req);
    expect(result).toEqual(chatInstances);
    expect(Chat.find).toHaveBeenCalledWith({
      $or: [{ owner: '0' }, { participants: '0' }]
    });
  });

  describe('createChat', () => {
    it('should create chat, include owner as participant and generate random string only once when it\'s unique', async () => {
      getRandomString.mockReturnValue('random-string');
      const result = await Mutation.createChat(undefined, { name: 'Chat' }, req);
      expect(result).toEqual({
        _id: 0,
        inviteLink: 'random-string',
        name: 'Chat',
        owner: '0',
        participants: ['0']
      });
      expect(getRandomString).toHaveBeenCalledTimes(1);
      expect(Chat.prototype.save).toHaveBeenCalledTimes(1);
    });

    it('should create chat and generate random string twice when it wasn\'t unique at the first time', async () => {
      getRandomString.mockReturnValue('random-string');
      Chat.findOne.mockReturnValueOnce({ name: 'Chat with duplicated invite link' });
      const result = await Mutation.createChat(undefined, { name: 'Chat' }, req);
      expect(result).toEqual({
        _id: 0,
        inviteLink: 'random-string',
        name: 'Chat',
        owner: '0',
        participants: ['0']
      });
      expect(getRandomString).toHaveBeenCalledTimes(2);
    });
  });

  describe('renameChat', () => {
    it('should throw error if user is not owner', async () => {
      await expect(Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req)).rejects.toThrow('Only owner can change chat');
      expect(Chat.findOne).toHaveBeenCalledWith({ _id: 0, owner: '0' });
    });

    it('should rename chat if user is owner', async () => {
      const instance = new Chat({ owner: 0 });
      Chat.findOne.mockReturnValueOnce(instance);
      await Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req);
      expect(instance).toEqual({ _id: 0, owner: 0, name: 'Renamed chat' });
      expect(Chat.findOne).toHaveBeenCalledWith({ _id: 0, owner: '0' });
      expect(instance.save).toHaveBeenCalledTimes(1);
    });

    it('should send notification to all participants except current user when chat renamed', async () => {
      const instance = new Chat({ owner: 0, participants: ['0', '1'] });
      Chat.findOne.mockReturnValueOnce(instance);
      await Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req);
      expect(req.app.wss.clients[0].send).not.toHaveBeenCalled();
      expect(req.app.wss.clients[1].send).toHaveBeenCalledWith(JSON.stringify({ type: 'chat_renamed', chatId: 0, name: 'Renamed chat' }));
    });
  });

  describe('postMessage', () => {
    it('should throw error if user is not chat\'s participant', async () => {
      await expect(Mutation.postMessage(undefined, { chatId: '0', text: 'Test' }, req))
        .rejects
        .toThrow('Invalid chat id');
    });

    it('should save message if user is a chat\'s participant', async () => {
      Chat.findOne.mockReturnValue({ name: 'Chat' });
      const result = await Mutation.postMessage(undefined, { chatId: '0', text: 'Test' }, req);
      expect(result).toEqual({
        _id: 0,
        author: '0',
        chat: '0',
        content: 'Test'
      });
      expect(Message.prototype.save).toHaveBeenCalled();
    });

    it('should send notification to all participants except current user when message posted', async () => {
      Chat.findOne.mockReturnValueOnce({ owner: 0, participants: ['0', '1'] });
      await Mutation.postMessage(undefined, { chatId: '0', text: 'Test' }, req);
      expect(req.app.wss.clients[0].send).not.toHaveBeenCalled();
      expect(req.app.wss.clients[1].send).toHaveBeenCalledWith(JSON.stringify({
        type: 'message_posted',
        message: {
          author: '0',
          content: 'Test',
          chat: '0',
          _id: 0
        }
      }));
    });
  });

  describe('joinChat', () => {
    it('should throw error with invalid link', async () => {
      await expect(Mutation.joinChat(undefined, { inviteLink: 'link' }, req))
        .rejects
        .toThrow('Invalid link');
    });

    it('should update chat on join', async () => {
      Chat.findOne.mockReturnValue(new Chat({ name: 'Chat', participants: ['1'] }));
      const result = await Mutation.joinChat(undefined, { inviteLink: 'link' }, req);
      expect(result).toEqual({ _id: 0, name: 'Chat', participants: ['1', '0'] });
      expect(Chat.prototype.save).toHaveBeenCalled();
    });

    it('should send notification to chat\'s participants', async () => {
      User.findById.mockReturnValueOnce({ _id: '0' });
      Chat.findOne.mockReturnValueOnce(new Chat({ _id: 0, participants: ['0', '1'] }));
      await Mutation.joinChat(undefined, { inviteLink: 'link' }, req);
      expect(req.app.wss.clients[0].send).not.toHaveBeenCalled();
      expect(req.app.wss.clients[1].send).toHaveBeenCalledWith(JSON.stringify({
        type: 'joined_chat',
        chatId: 0,
        participant: { _id: '0' }
      }));
    });
  });
});