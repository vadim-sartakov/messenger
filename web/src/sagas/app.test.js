import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { loadApp, initializeSocket, watchSocket, sleep } from './app';
import { tokenSelector } from './auth';
import graphqlFetch from '../utils/graphqlFetch';
import { INITIALIZE_SUCCEEDED, INITIALIZE_FAILED, DESTROY_SUCCEEDED, SHOW_MESSAGE, DESTROY_REQUESTED } from '../actions';

describe('app saga', () => {
  describe('loadApp', () => {
    it('should load app', async () => {
      await expectSaga(loadApp)
        .provide([
          [select(tokenSelector), 'token'],
          [matchers.call.fn(graphqlFetch), { data: { me: 'me', chats: 'chats' } }]
        ])
        .put({ type: INITIALIZE_SUCCEEDED, data: { me: 'me', chats: 'chats' } })
        .run();
    });

    it('should fail to load app on error', async () => {
      await expectSaga(loadApp)
        .provide([
          [select(tokenSelector), 'token'],
          [matchers.call.fn(graphqlFetch), throwError(new Error('test'))]
        ])
        .put({ type: INITIALIZE_FAILED })
        .run();
    });
  });

  describe('initializeSocket', () => {
    let closeMock = jest.fn();
    beforeEach(() => {
      global.WebSocket = jest.fn(() => {
        return { close: closeMock };
      });
    });
    afterEach(() => {
      global.WebSocket.mockReset();
      closeMock.mockReset();
    });

    it('should init socket', async () => {
      await expectSaga(initializeSocket)
        .provide([
          [select(tokenSelector), 'token']
        ])
        .not.put({ type: DESTROY_SUCCEEDED })
        .not.put({ type: SHOW_MESSAGE })
        .silentRun();
      expect(WebSocket).toHaveBeenCalledTimes(1);
      expect(closeMock).not.toHaveBeenCalled();
    });

    it('should reconnect on close', async () => {
      let counter = 0;
      await expectSaga(initializeSocket)
        .provide([
          [select(tokenSelector), 'token'],
          {
            call: (event, next) => {
              if (event.fn === watchSocket && counter < 2) {
                counter++;
                return true;
              } else {
                return next();
              }
            }
          },
          [matchers.call.fn(sleep), undefined]
        ])
        .put({ type: SHOW_MESSAGE, severity: 'error', text: 'Disconnected. Trying to reconnect...' })
        .silentRun();
        expect(WebSocket).toBeCalledTimes(3);
        expect(closeMock).not.toHaveBeenCalled();
    });

    it('should close socket on destroy', async () => {
      await expectSaga(initializeSocket)
        .provide([
          [select(tokenSelector), 'token']
        ])
        .dispatch({ type: DESTROY_REQUESTED })
        .run();
      expect(closeMock).toHaveBeenCalled();
    });
  });
});