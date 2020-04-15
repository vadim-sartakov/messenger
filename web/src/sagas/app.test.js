import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import {
  messageTypes,
  loadApp,
  initializeSocket,
  watchSocket,
  sleep,
  createSocketChannel,
  createChat,
  joinChat
} from './app';
import { tokenSelector } from './auth';
import graphqlFetch from '../utils/graphqlFetch';
import {
  INITIALIZE_SUCCEEDED,
  INITIALIZE_FAILED,
  DESTROY_SUCCEEDED,
  SHOW_MESSAGE,
  DESTROY_REQUESTED,
  RENAME_CHAT_SUCCEEDED,
  ADD_CHAT_PARTICIPANT,
  POST_MESSAGE_SUCCEEDED,
  CREATE_CHAT_SUCCEEDED
} from '../actions';
import { JOIN_CHAT, CREATE_CHAT, HOME } from '../queries';
import { GRAPHQL_URL } from '../constants';

jest.mock('../utils/graphqlFetch');

describe('app saga', () => {
  afterEach(() => graphqlFetch.mockReset());

  describe('loadApp', () => {
    it('should load app', async () => {
      const response = { data: { me: 'me', chats: 'chats' } };
      graphqlFetch.mockImplementation(() => response);
      await expectSaga(loadApp)
        .provide([
          [select(tokenSelector), 'token']
        ])
        .put({ type: INITIALIZE_SUCCEEDED, data: response.data })
        .run();
      expect(graphqlFetch.mock.calls[0][0]).toEqual(HOME);
      expect(graphqlFetch.mock.calls[0][1]).toEqual({ url: GRAPHQL_URL, token: 'token' });
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

  describe('watchSocket', () => {
    it('should show success message on reconnect', async () => {
      let counter = 0;
      await expectSaga(watchSocket, {}, true)
        .provide([
          [matchers.call.fn(createSocketChannel), 'channel'],
          { take: (event, next) => counter++ === 0 ? { type: messageTypes.OPEN } : next() }
        ])
        .put({ type: SHOW_MESSAGE, severity: 'success', text: 'Successfully reconnected!', autoHide: true })
        .silentRun();
    });

    it('should return true when disconnected', async () => {
      await expectSaga(watchSocket, {}, true)
        .provide([
          [matchers.call.fn(createSocketChannel), 'channel'],
          { take: () => ({ type: messageTypes.CLOSE }) }
        ])
        .returns(true)
        .run();
    });

    it('should dispatch rename chat', async () => {
      let counter = 0;
      await expectSaga(watchSocket, {}, true)
        .provide([
          [matchers.call.fn(createSocketChannel), 'channel'],
          { take: (event, next) => counter++ === 0 ? { type: messageTypes.CHAT_RENAMED, chatId: 0, name: 'Test' } : next() }
        ])
        .put({ type: RENAME_CHAT_SUCCEEDED, chatId: 0, name: 'Test' })
        .silentRun();
    });

    it('should dispatch add chat participant on join chat', async () => {
      let counter = 0;
      await expectSaga(watchSocket, {}, true)
        .provide([
          [matchers.call.fn(createSocketChannel), 'channel'],
          { take: (event, next) => counter++ === 0 ? { type: messageTypes.JOINED_CHAT, chatId: 0, participant: 'Test' } : next() }
        ])
        .put({ type: ADD_CHAT_PARTICIPANT, chatId: 0, participant: 'Test' })
        .silentRun();
    });

    it('should dispatch post message', async () => {
      let counter = 0;
      await expectSaga(watchSocket, {}, true)
        .provide([
          [matchers.call.fn(createSocketChannel), 'channel'],
          { take: (event, next) => counter++ === 0 ? { type: messageTypes.MESSAGE_POSTED, chatId: 0, message: 'Test' } : next() }
        ])
        .put({ type: POST_MESSAGE_SUCCEEDED, chatId: 0, message: 'Test' })
        .silentRun();
    });
  });

  describe('createChat', () => {
    it('should send request and redirect on success', async () => {
      const history = {
        replace: jest.fn()
      };
      const response =  { data: { createChat: { _id: 0 } } };
      graphqlFetch.mockImplementation(() => response);
      await expectSaga(createChat, { name: 'Test', history })
        .provide([
          [select(tokenSelector), 'token']
        ])
        .put({ type: CREATE_CHAT_SUCCEEDED, chat: response.data.createChat })
        .run();
      expect(graphqlFetch.mock.calls[0][0]).toEqual(CREATE_CHAT);
      expect(graphqlFetch.mock.calls[0][1]).toEqual({ url: GRAPHQL_URL, token: 'token', variables: { name: 'Test' } });
      expect(history.replace.mock.calls[0][0]).toEqual({ pathname: '/chats/0' });
    });
  });

  describe('joinChat', () => {
    it('should dispatch join chat and redirect on success', async () => {
      const response =  { data: { joinChat: { _id: 0 } } };
      graphqlFetch.mockImplementation(() => response);
      const history = {
        replace: jest.fn()
      };
      await expectSaga(joinChat, { inviteLink: 'Link', history })
        .provide([
          [select(tokenSelector), 'token']
        ])
        .put({ type: CREATE_CHAT_SUCCEEDED, chat: response.data.joinChat })
        .run();
      expect(graphqlFetch.mock.calls[0][0]).toEqual(JOIN_CHAT);
      expect(graphqlFetch.mock.calls[0][1]).toEqual({ url: GRAPHQL_URL, token: 'token', variables: { inviteLink: 'Link' } });
      expect(history.replace.mock.calls[0][0]).toEqual({ pathname: '/chats/0' });
    });
  });
});