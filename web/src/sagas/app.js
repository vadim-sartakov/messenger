import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, all, fork, actionChannel } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';

const messageTypes = {
  POST_MESSAGE: 'POST_MESSAGE'
};

function createSocket(token) {
  const socket = new WebSocket(`${WS_URL}?token=${token}`);
  return socket;
}

function createSocketChannel(socket) {
  return eventChannel(emit => {
    const messageHandler = event => {
      emit(JSON.parse(event.data));
    };
    socket.onmessage = messageHandler;
    const unsubscribe = () => {
      socket.close();
    }
    return unsubscribe;
  });
}

function* watchSocket(socket) {
  const socketChannel = yield createSocketChannel(socket);
  while(true) {
    const { type, chatId, message } = yield take(socketChannel);
    switch (type) {
      case messageTypes.POST_MESSAGE:
        yield put({ type: actions.ADD_MESSAGE, chatId, message });
        break;
      default:
    }
  }
}

function* watchRequests(socket, token) {
  const requestChannel = yield actionChannel([actions.POST_MESSAGE_REQUESTED])
  while(true) {
    const { chatId, message } = yield take(requestChannel);
    const { app: { chats, me } } = yield select();
    const curChat = chats.find(chat => chat._id === chatId);
    const newMessage = { content: message.content, author: me, createdAt: new Date() };
    yield put({ type: actions.ADD_MESSAGE, chatId, message: newMessage });
    yield fork([socket, 'send'], JSON.stringify({
      type: messageTypes.POST_MESSAGE,
      chatId,
      participants: curChat.participants,
      message: newMessage
    }));
    yield fork(graphqlFetchUtil, queries.POST_MESSAGE, { token, url: GRAPHQL_URL, variables: { chatId, content: message.content } });
  }
}

function* fetchData(token, query, { variables, successAction, failAction }) {
  let content;
  try {
    content = yield call(graphqlFetchUtil, query, { url: GRAPHQL_URL, variables, token });
    yield put({ type: successAction, data: content.data });
  } catch (error) {
    yield put({ type: failAction });
    yield put({ type: actions.SHOW_ERROR, message: 'Failed to execute request. Please try again later' });
  }
}

function* initialize() {
  const state = yield select();
  const { token } = state.auth;
  let socket
  try {
    socket = yield call(createSocket, token);
  } catch (err) {
    yield put({ type: actions.SHOW_ERROR, message: 'Failed to connect. Please try again later' });
    return;
  }
  yield fork(fetchData, token, queries.HOME, { successAction: actions.INITIALIZE_SUCCEEDED, failAction: actions.INITIALIZE_FAILED });
  yield fork(watchRequests, socket, token);
  yield fork(watchSocket, socket);
  
  yield take(actions.DESTROY_REQUESTED);
  try {
    socket.close();
  } catch (err) {
    yield put({ type: actions.SHOW_ERROR, message: 'Failed to close connection' });
  }
  yield put({ type: actions.DESTROY_SUCCEEDED });
}

function* initializeChat({ id }) {
  const state = yield select();
  const { token } = state.auth;
  yield call(fetchData, token, queries.CHAT_DETAILS, {
    variables: { id },
    successAction: actions.INITIALIZE_CHAT_SUCCEEDED,
    failAction: actions.INITIALIZE_CHAT_FAILED
  });
}

export default function* appSaga() {
  yield all([
    takeLatest(actions.INITIALIZE_REQUESTED, initialize),
    takeLatest(actions.INITIALIZE_CHAT_REQUESTED, initializeChat)
  ])
}