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
      emit(event.data);
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
    const { type, ...message } = yield take(socketChannel);
    switch (type) {
      case messageTypes.POST_MESSAGE:
        yield put({ type: actions.RECEIVE_MESSAGE, message });
        break;
      default:
    }
  }
}

function* watchRequests(socket, token) {
  const requestChannel = yield actionChannel([actions.POST_MESSAGE_REQUESTED])
  while(true) {
    const { chat, content } = yield take(requestChannel);
    yield all([
      call([socket, 'send'], { type: messageTypes.POST_MESSAGE, chat, content }),
      call(graphqlFetchUtil, queries.POST_MESSAGE, { token, variables: { value: { chat, content } } })
    ])
  }
}

function* loadData(token) {
  let content;
  try {
    content = yield call(graphqlFetchUtil, queries.HOME, { url: GRAPHQL_URL, token });
    yield put({ type: actions.INITIALIZE_SUCCEEDED, data: content.data });
  } catch (error) {
    yield put({ type: actions.INITIALIZE_FAILED });
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
  yield fork(loadData, token);  
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

export default function* appSaga() {
  yield takeLatest(actions.INITIALIZE_REQUESTED, initialize);
}