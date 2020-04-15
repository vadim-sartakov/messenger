const { Query } = require('./resolvers');
const User = require('../models/User');

jest.mock('../models/User');

describe('graphql resolvers', () => {
  afterEach(() => User.mockReset());
  it('me', async () => {
    const userInstance = { _id: 0, name: 'User' };
    User.findById.mockImplementation(() => userInstance);
    const result = await Query.me(undefined, undefined, { user: { subject: 0 } });
    expect(result).toEqual(userInstance);
  });
});