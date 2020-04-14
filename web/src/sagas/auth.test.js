import { runSaga } from 'redux-saga';
import { TOKEN_EXPIRED, LOGIN_SUCCEEDED, LOGIN_FAILED, SHOW_MESSAGE } from '../actions';
import { watchTokenExpiration, authorize } from './auth';

describe('auth saga', () => {
  describe('watchTokenExpiration', () => {
    const createToken = exp => {
      const token = btoa(JSON.stringify({})) + '.' + btoa(JSON.stringify({ exp }));
      return token;
    };

    it('should trigger token expiration when expired', async () => {
      const dispatched = [];
      const token = createToken((new Date().getTime() - 1000) / 1000);
      await runSaga({
        dispatch: action => dispatched.push(action),
        getState: () => ({ auth: { token } })
      }, watchTokenExpiration, ).toPromise();
      expect(dispatched[0].type).toBe(TOKEN_EXPIRED);
    });
  });

  describe('authorize', () => {
    beforeEach(() => global.fetch = jest.fn());
    afterEach(() => global.fetch.mockReset());

    it('should authorize', async () => {
      fetch.mockReturnValue(Promise.resolve({
        ok: true,
        json: () => ({ token: true })
      }));
      const credentials = { name: 'Test' };
      const location = { state: { from: { pathname: '/prev' } } };
      const history = {
        replace: jest.fn()
      };
      const dispatched = [];
      await runSaga({
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      }, authorize, { credentials, location, history }).toPromise();

      expect(fetch.mock.calls[0][0]).toBe('/login');
      expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(credentials));

      expect(history.replace.mock.calls[0][0]).toEqual('/prev');

      expect(dispatched[0].type).toBe(LOGIN_SUCCEEDED);
      expect(dispatched[0].token).toBe(true);
    });

    it('should fail to authorize on error', async () => {
      fetch.mockReturnValue(Promise.reject());
      const credentials = { name: 'Test' };
      const dispatched = [];
      await runSaga({
        dispatch: action => dispatched.push(action),
        getState: () => ({})
      }, authorize, { credentials, location, history }).toPromise();
      expect(dispatched[0].type).toBe(LOGIN_FAILED);
      expect(dispatched[1].type).toBe(SHOW_MESSAGE);
    });
  });
});