import { eventChannel } from 'redux-saga';
import { takeLatest, select, take, call, put, fork, actionChannel, delay, race, cancel, all } from 'redux-saga/effects';
import * as actions from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import * as queries from '../queries';
import { GRAPHQL_URL, WS_URL } from '../constants';

const messageTypes = {
  OPEN: 'open',
  CLOSE: 'close',
  JOINED_CHAT: 'joined_chat',
  POST_MESSAGE: 'post_message'
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
      case messageTypes.JOINED_CHAT:
        yield put({ type: actions.ADD_CHAT_PARTICIPANT, chatId: action.chatId, participant: action.participant });
        break;
      case messageTypes.POST_MESSAGE:
        yield put({ type: actions.ADD_MESSAGE, chatId: action.chatId, message: action.message });
        break;
      default:
    }
  }
}

function* handleSendMessage(socket, token, action) {
  const { chatId, message } = action;
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

function* watchRequests(socket, token) {
  const requestChannel = yield actionChannel([actions.POST_MESSAGE_REQUESTED]);
  while(true) {
    const { type, ...action } = yield take(requestChannel);
    switch (type) {
      case actions.POST_MESSAGE_REQUESTED:
        yield handleSendMessage(socket, token, action);
        break;
      default:
    }
    
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

function* createChat({ chat, history }) {
  const { auth: { token } } = yield select();
  try {
    const response = yield call(graphqlFetchUtil, queries.CREATE_CHAT, { url: GRAPHQL_URL, variables: { value: chat }, token });
    yield put({ type: actions.CREATE_CHAT_SUCCEEDED, chat: response.data.createChat });
    yield call ([history, 'replace'], { pathname: `/chats/${response.data.createChat._id}` });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to create chat. Please try again later' });
  }
}

function* joinChat({ inviteLink, history }) {
  const { auth: { token } } = yield select();
  try {
    const response = yield call(graphqlFetchUtil, queries.JOIN_CHAT, { url: GRAPHQL_URL, token, variables: { inviteLink } });
    const chat = response.data.joinChat;
    yield put({ type: actions.JOIN_CHAT_SUCCEEDED, chat });
    yield call([history, 'replace'], { pathname: `/chats/${chat._id}` });
  } catch(err) {
    yield put({ type: actions.SHOW_MESSAGE, severity: 'error', text: 'Failed to join chat' });
  }
}

export default function* appSaga() {
  yield all([
    takeLatest(actions.INITIALIZE_REQUESTED, initialize),
    takeLatest(actions.CREATE_CHAT_REQUESTED, createChat),
    takeLatest(actions.JOIN_CHAT_REQUESTED, joinChat)
  ]);
}