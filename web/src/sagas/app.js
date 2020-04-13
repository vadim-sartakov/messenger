import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, all, fork, actionChannel, delay } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';

const messageTypes = {
  OPEN: 'OPEN',
  POST_MESSAGE: 'POST_MESSAGE'
};

function createSocket(token) {
  const socket = new WebSocket(`${WS_URL}?token=${token}`);
  return socket;
}

function createSocketChannel(socket) {
  return eventChannel(emit => {
    socket.onmessage = event => {
      emit(JSON.parse(event.data));
    };
    socket.onopen = () => {
      emit({ type: messageTypes.OPEN });
    }
    socket.onclose = () => {
      emit(new Error('Channel was closed'));
    }
    const unsubscribe = () => {
      socket.close();
    }
    return unsubscribe;
  });
}

function* watchSocket(socket, reconnect) {
  let socketChannel = yield createSocketChannel(socket);
  while(true) {
    const { type, chatId, message } = yield take(socketChannel);
    switch (type) {
      case messageTypes.OPEN:
        if (reconnect) {
          yield put({ type: actions.SHOW_MESSAGE, severity: 'success', text: 'Successfully reconnected!', autoHide: true });
        }  
        break;
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

function* listenSocket(socket, token, reconnect) {
  yield fork(watchRequests, socket, token);
  yield fork(watchSocket, socket, reconnect);
  yield take(actions.DESTROY_REQUESTED);
  socket.onclose = undefined;
  socket.close();
}

function* initializeSocket(token, reconnect) {
  let socket
  try {
    socket = yield call(createSocket, token);
  } catch (err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to connect. Please try again later' });
    return;
  }

  try {
    yield call(listenSocket, socket, token, reconnect);
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Disconnected. Trying to reconnect...' });
    yield delay(5000);
    yield initializeSocket(token, true);
    return;
  }
}

function* fetchData(token, query, { variables, successAction, failAction }) {
  let content;
  try {
    content = yield call(graphqlFetchUtil, query, { url: GRAPHQL_URL, variables, token });
    yield put({ type: successAction, data: content.data });
  } catch (error) {
    yield put({ type: failAction });
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to execute request. Please try again later' });
  }
}

function* initialize() {
  const state = yield select();
  const { token } = state.auth;
  yield fork(initializeSocket, token);
  yield fork(fetchData, token, queries.HOME, { successAction: actions.INITIALIZE_SUCCEEDED, failAction: actions.INITIALIZE_FAILED });
  yield take(actions.DESTROY_REQUESTED);
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