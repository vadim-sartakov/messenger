import { select } from 'redux-saga/effects';
import { tokenSelector } from './auth';
import { expectSaga } from 'redux-saga-test-plan';
import { TOKEN_EXPIRED, LOGIN_SUCCEEDED, LOGIN_FAILED, SHOW_MESSAGE } from '../actions';
import { watchTokenExpiration, authorize } from './auth';

describe('auth saga', () => {
  describe('watchTokenExpiration', () => {
    const createToken = exp => {
      const token = btoa(JSON.stringify({})) + '.' + btoa(JSON.stringify({ exp }));
      return token;
    };

    it('should trigger token expiration when expired', async () => {
      const token = createToken((new Date().getTime() - 1000) / 1000);
      await expectSaga(watchTokenExpiration)
        .provide([
          [select(tokenSelector), token]
        ])
        .put({ type: TOKEN_EXPIRED })
        .run();
    });

    it('should not trigger token expiration when not expired', async () => {
      const token = createToken((new Date().getTime() + 1000) / 1000);
      await expectSaga(watchTokenExpiration)
        .provide([
          [select(tokenSelector), token]
        ])
        .not.put({ type: TOKEN_EXPIRED })
        .silentRun();
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
      await expectSaga(authorize, { credentials, location, history })
        .put({ type: LOGIN_SUCCEEDED, token: true })
        .run();

      expect(fetch.mock.calls[0][0]).toBe('/api/login');
      expect(fetch.mock.calls[0][1].body).toBe(JSON.stringify(credentials));

      expect(history.replace.mock.calls[0][0]).toEqual('/prev');
    });

    it('should fail to authorize on error', async () => {
      fetch.mockReturnValue(Promise.reject());
      const credentials = { name: 'Test' };
      await expectSaga(authorize, { credentials })
        .put({ type: LOGIN_FAILED })
        .put({
          type: SHOW_MESSAGE,
          severity: 'error',
          text: 'Failed to execute request. Please try again later',
          autoHide: true
        })
        .run();
    });
  });
});