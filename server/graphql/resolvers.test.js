const { Query, Mutation } = require('./resolvers');
const User = require('../models/User');
const Chat = require('../models/Chat');
const getRandomString = require('../utils/getRandomString');

jest.mock('../utils/getRandomString');
jest.mock('../models/User');
jest.mock('../models/Chat');

describe('graphql resolvers', () => {
  beforeEach(() => {
    getRandomString.mockReset();
    User.mockReset();
    Chat.mockReset();
  });
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

  it('me', async () => {
    const userInstance = { _id: 0, name: 'User' };
    User.findById.mockImplementation(() => userInstance);
    const result = await Query.me(undefined, undefined, req);
    expect(result).toEqual(userInstance);
  });

  it('getChats', async () => {
    const chatInstances = [{ _id: 0, name: 'Chat' }];
    Chat.find.mockImplementation(() => chatInstances);
    const result = await Query.getChats(undefined, undefined, req);
    expect(result).toEqual(chatInstances);
    expect(Chat.find).toHaveBeenCalledWith({
      $or: [{ owner: '0' }, { participants: '0' }]
    });
  });

  describe('createChat', () => {
    it('should create chat and generate random string only once when it\'s unique', async () => {
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
    it('should rename chat if user is owner', async () => {
      const instance = new Chat({ owner: 0 });
      Chat.findOne.mockReturnValueOnce(instance);
      await Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req);
      expect(instance).toEqual({ owner: 0, name: 'Renamed chat' });
      expect(Chat.findOne).toHaveBeenCalledWith({ _id: 0, owner: '0' });
      expect(instance.save).toHaveBeenCalledTimes(1);
    });

    it('should send notification to participants when chat renamed', async () => {
      const instance = new Chat({ owner: 0, participants: ['0', '1'] });
      Chat.findOne.mockReturnValueOnce(instance);
      await Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req);
      expect(req.app.wss.clients[1].send).toHaveBeenCalledWith(JSON.stringify({ type: 'chat_renamed', name: 'Renamed chat' }));
    });

    it('should throw error if user is not owner', async () => {
      await expect(Mutation.renameChat(undefined, { id: 0, name: 'Renamed chat' }, req)).rejects.toThrow('Only owner can change chat');
      expect(Chat.findOne).toHaveBeenCalledWith({ _id: 0, owner: '0' });
    });
  });
});