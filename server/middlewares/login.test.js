jest.mock('jsonwebtoken');
jest.mock('../models/User');
jest.mock('../constants/jwt', () => ({ publicKey: '123456', expiresIn: '8h' }));
const { sign } = require('jsonwebtoken');
const User = require('../models/User');
const login = require('./login');

class UserMock {
  constructor(value) {
    Object.assign(this, value);
  }
  async save() {
    return this;
  }
}

describe('login middleware', () => {
  it('should return token on success login', async () => {
    const req = { body: { name: 'Name', other: 'other' } };
    User.prototype.save.mockImplementation(() => ({ name: 'Name' }))
    //const userInstance = { name: 'Name' };
    sign.mockImplementation((payload, secret, options, cb) => cb(null, 'token'));
    const res = {
      json: jest.fn()
    };
    await login(req, res);
    expect(User.mock.calls[0][0]).toEqual({ name: 'Name' });
    console.log(sign.mock.calls[0])
    expect(res.json).toHaveBeenCalledWith({ token: 'token' });
  });
});