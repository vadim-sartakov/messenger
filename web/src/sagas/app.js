import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, fork, actionChannel, delay, race, cancel } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';

const messageTypes = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
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
    };
    socket.onclose = () => {
      emit({ type: messageTypes.CLOSE });
    };
    const unsubscribe = () => {
      socket.close();
    };
    return unsubscribe;
  });
}

function* watchSocket(socket, reconnect) {
  let socketChannel = createSocketChannel(socket);
  while(true) {
    const { type, chatId, message } = yield take(socketChannel);
    switch (type) {
      case messageTypes.OPEN:
        if (reconnect) {
          yield put({ type: actions.SHOW_MESSAGE, severity: 'success', text: 'Successfully reconnected!', autoHide: true });
        }  
        break;
      case messageTypes.CLOSE:
        return true;
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

function* initializeSocket(socket, token, reconnect) {
  while(true) {
    const watchRequestsTask = yield fork(watchRequests, socket, token);
    const disconnected = yield call(watchSocket, socket, reconnect);
    yield cancel(watchRequestsTask);
    return disconnected;
  }
}

function* fetchData(token, query, { variables, successAction, failAction }) {
  let content;
  try {
    content = yield call(graphqlFetchUtil, query, { url: GRAPHQL_URL, variables, token });
    yield put({ type: successAction, data: content.data });
  } catch (error) {
    yield put({ type: failAction });
  }
}

function* initialize({ reconnect }) {
  const state = yield select();
  const { token } = state.auth;
  const socket = yield call(createSocket, token);
  yield fork(fetchData, token, queries.HOME, { successAction: actions.INITIALIZE_SUCCEEDED, failAction: actions.INITIALIZE_FAILED });
  const { disconnected, destroy } = yield race({
    disconnected: call(initializeSocket, socket, token, reconnect),
    destroy: take(actions.DESTROY_REQUESTED)
  });
  if (destroy) {
    yield call([socket, 'close']);
    yield put({ type: actions.DESTROY_SUCCEEDED });
  } else if (disconnected) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Disconnected. Trying to reconnect...' });
    yield delay(5000);
    yield initialize({ reconnect: true });
  }
}

export default function* appSaga() {
  yield takeLatest(actions.INITIALIZE_REQUESTED, initialize);
}