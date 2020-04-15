const { sign } = require('jsonwebtoken');
const User = require('../models/User');
const login = require('./login');

jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../constants/jwt', () => ({ publicKey: '123456', expiresIn: '8h' }));

describe('login middleware', () => {
  it('should return token on success login', async () => {
    const req = { body: { name: 'Name', other: 'other' } };
    const userInstace = {
      name: 'Name',
      save: jest.fn(async () => {
        return { ...userInstace, _id: 0 }
      })
    };
    User.mockImplementation(() => userInstace)
    sign.mockImplementation((payload, secret, options, cb) => cb(null, 'token'));
    const res = {
      json: jest.fn()
    };
    await login(req, res);
    expect(User.mock.calls[0][0]).toEqual({ name: 'Name' });
    expect(sign.mock.calls[0][0]).toEqual({ subject: 0 });
    expect(sign.mock.calls[0][1]).toEqual('123456');
    expect(sign.mock.calls[0][2]).toEqual({ expiresIn: '8h' });
    expect(res.json).toHaveBeenCalledWith({ token: 'token' });
  });
});