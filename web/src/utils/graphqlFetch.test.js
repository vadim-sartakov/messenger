import graphqlFetch from './graphqlFetch';

describe('graphqlFetch', () => {
  beforeEach(() => global.fetch = jest.fn());
  afterEach(() => global.fetch.mockReset());

  it('should include headers and body on execute', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: async () => ({})
    }));
    await graphqlFetch('query-string', { url: '/', token: 'test-token', variables: { test: 'test' } });
    expect(fetch.mock.calls[0][0]).toEqual('/');
    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer test-token`
      },
      body: JSON.stringify({ query: 'query-string', variables: { test: 'test' } })
    });
  });

  it('should reject on general error', async () => {
    fetch.mockReturnValue(Promise.reject());
    await expect(graphqlFetch('query-string', {})).rejects.toBeFalsy();
  });

  it('should reject on non-ok response', async () => {
    fetch.mockReturnValue(Promise.resolve({ ok: false }));
    await expect(graphqlFetch('query-string', {})).rejects.toEqual({ ok: false });
  });

  it('should reject on errors', async () => {
    fetch.mockReturnValue(Promise.resolve({
      ok: true,
      json: async () => ({ errors: 'error' })
    }));
    await expect(graphqlFetch('query-string', {})).rejects.toEqual({ errors: "error" });
  });
});