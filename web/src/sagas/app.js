import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, delay, race, all, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';
import { tokenSelector } from './auth';

export const messageTypes = {
  OPEN: 'open',
  CLOSE: 'close',
  CHAT_RENAMED: 'chat_renamed',
  JOINED_CHAT: 'joined_chat',
  MESSAGE_POSTED: 'message_posted'
};

function createSocket(token) {
  const socket = new WebSocket(`${WS_URL}?token=${token}`);
  return socket;
}

export function createSocketChannel(socket) {
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

export function* watchSocket(socket, reconnect) {
  let socketChannel = yield call(createSocketChannel, socket);
  while(true) {
    const { type, ...action } = yield take(socketChannel);
    switch (type) {
      case messageTypes.OPEN:
        if (reconnect) {
          yield put({ type: actions.SHOW_MESSAGE, severity: 'success', text: 'Successfully reconnected!', autoHide: true });
        }  
        break;
      case messageTypes.CLOSE:
        return true;
      case messageTypes.CHAT_RENAMED:
        yield put({ type: actions.RENAME_CHAT_SUCCEEDED, chatId: action.chatId, name: action.name });
        break;
      case messageTypes.JOINED_CHAT:
        yield put({ type: actions.ADD_CHAT_PARTICIPANT, chatId: action.chatId, participant: action.participant });
        break;
      case messageTypes.MESSAGE_POSTED:
        yield put({ type: actions.POST_MESSAGE_SUCCEEDED, chatId: action.chatId, message: action.message });
        break;
      default:
    }
  }
}

export function* loadApp() {
  const token = yield select(tokenSelector);
  try {
    const content = yield call(graphqlFetchUtil, queries.HOME, { url: GRAPHQL_URL, token });
    yield put({ type: actions.INITIALIZE_SUCCEEDED, data: content.data });
  } catch (error) {
    yield put({ type: actions.INITIALIZE_FAILED });
  }
}

function* destroyApp() {
  yield put({ type: actions.DESTROY_SUCCEEDED });
}

/** For testing purposes */
export function* sleep(ms) {
  yield delay(ms);
}

export function* initializeSocket() {
  let reconnect = false;
  while (true) {
    const token = yield select(tokenSelector);
    const socket = createSocket(token);
    const { disconnected, destroy } = yield race({
      disconnected: call(watchSocket, socket, reconnect),
      destroy: take(actions.DESTROY_REQUESTED)
    });
    if (destroy) {
      yield call([socket, 'close']);
      return;
    } else if (disconnected) {
      yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Disconnected. Trying to reconnect...' });
      yield call(sleep, 5000);
      reconnect = true;
    }
  }
}

export function* createChat({ name, history }) {
  const token = yield select(tokenSelector);
  try {
    const response = yield call(graphqlFetchUtil, queries.CREATE_CHAT, { url: GRAPHQL_URL, variables: { name }, token });
    yield put({ type: actions.CREATE_CHAT_SUCCEEDED, chat: response.data.createChat });
    yield call ([history, 'replace'], { pathname: `/chats/${response.data.createChat._id}` });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to create chat. Please try again later' });
  }
}

export function* renameChat({ chatId, name }) {
  const token = yield select(tokenSelector);
  try {
    yield call(graphqlFetchUtil, queries.RENAME_CHAT, { url: GRAPHQL_URL, variables: { id: chatId, name }, token });
    yield put({ type: actions.RENAME_CHAT_SUCCEEDED, chatId, name });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to update chat. Please try again later' });
  }
}

export function* joinChat({ inviteLink, history }) {
  const token = yield select(tokenSelector);
  try {
    const response = yield call(graphqlFetchUtil, queries.JOIN_CHAT, { url: GRAPHQL_URL, token, variables: { inviteLink } });
    const chat = response.data.joinChat;
    yield put({ type: actions.CREATE_CHAT_SUCCEEDED, chat });
    yield call([history, 'replace'], { pathname: `/chats/${chat._id}` });
  } catch(err) {
    console.log(err)
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to join chat' });
  }
}

export function* postMessage({ chatId, text }) {
  const token = yield select(tokenSelector);
  const me = yield select(state => state.app.me);
  const newMessage = { content: text, author: me, createdAt: new Date() };
  yield put({ type: actions.POST_MESSAGE_SUCCEEDED, chatId, message: newMessage });
  yield call(graphqlFetchUtil, queries.POST_MESSAGE, { token, url: GRAPHQL_URL, variables: { chatId, text } });
}

export default function* appSaga() {
  yield all([
    takeLatest(actions.INITIALIZE_REQUESTED, loadApp),
    takeLatest(actions.INITIALIZE_REQUESTED, initializeSocket),
    takeLatest(actions.DESTROY_REQUESTED, destroyApp),
    takeLatest(actions.CREATE_CHAT_REQUESTED, createChat),
    takeLatest(actions.JOIN_CHAT_REQUESTED, joinChat),
    takeLatest(actions.RENAME_CHAT_REQUESTED, renameChat),
    takeEvery(actions.POST_MESSAGE_REQUESTED, postMessage)
  ]);
}