import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, fork, delay, race, all, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';

const messageTypes = {
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
    disconnected: call(watchSocket, socket, reconnect),
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

function* createChat({ name, history }) {
  const { auth: { token } } = yield select();
  try {
    const response = yield call(graphqlFetchUtil, queries.CREATE_CHAT, { url: GRAPHQL_URL, variables: { name }, token });
    yield put({ type: actions.CREATE_CHAT_SUCCEEDED, chat: response.data.createChat });
    yield call ([history, 'replace'], { pathname: `/chats/${response.data.createChat._id}` });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to create chat. Please try again later' });
  }
}

function* renameChat({ chatId, name }) {
  const { auth: { token } } = yield select();
  try {
    yield call(graphqlFetchUtil, queries.RENAME_CHAT, { url: GRAPHQL_URL, variables: { id: chatId, name }, token });
    yield put({ type: actions.RENAME_CHAT_SUCCEEDED, chatId, name });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to update chat. Please try again later' });
  }
}

function* joinChat({ inviteLink, history }) {
  const { auth: { token } } = yield select();
  try {
    const response = yield call(graphqlFetchUtil, queries.JOIN_CHAT, { url: GRAPHQL_URL, token, variables: { inviteLink } });
    const chat = response.data.joinChat;
    yield put({ type: actions.CREATE_CHAT_SUCCEEDED, chat });
    yield call([history, 'replace'], { pathname: `/chats/${chat._id}` });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to join chat' });
  }
}

function* postMessage({ chatId, text }) {
  const { auth: { token }, app: { me } } = yield select();
  const newMessage = { content: text, author: me, createdAt: new Date() };
  yield put({ type: actions.POST_MESSAGE_SUCCEEDED, chatId, message: newMessage });
  yield call(graphqlFetchUtil, queries.POST_MESSAGE, { token, url: GRAPHQL_URL, variables: { chatId, text } });
}

export default function* appSaga() {
  yield all([
    takeLatest(actions.INITIALIZE_REQUESTED, initialize),
    takeLatest(actions.CREATE_CHAT_REQUESTED, createChat),
    takeLatest(actions.JOIN_CHAT_REQUESTED, joinChat),
    takeLatest(actions.RENAME_CHAT_REQUESTED, renameChat),
    takeEvery(actions.POST_MESSAGE_REQUESTED, postMessage)
  ]);
}