import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  INITIALIZE_REQUESTED,
  INITIALIZE_SUCCEEDED,
  INITIALIZE_FAILED,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  CREATE_CHAT_SUCCEEDED,
  UPDATE_CHAT_SUCCEEDED,
  JOIN_CHAT_SUCCEEDED,
  ADD_CHAT_PARTICIPANT,
  DESTROY_SUCCEEDED,
  ADD_MESSAGE
} from '../actions';

const initialState = { isLoading: true, chat: { isLoading: true } };

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case INITIALIZE_REQUESTED:
      return { ...state, isLoading: true };
    case INITIALIZE_SUCCEEDED:
      return { ...state, isLoading: false, me: action.data.me, chats: action.data.chats };
    case INITIALIZE_FAILED:
      return { ...state, isLoading: false, error: true };
    case SHOW_MESSAGE:
      return { ...state, message: { ...action, open: true } };
    case HIDE_MESSAGE:
      return { ...state, message: { ...state.message, open: false } };
    case CREATE_CHAT_SUCCEEDED:
      return { ...state, chats: [...state.chats, action.chat] };
    case ADD_CHAT_PARTICIPANT:
      return {
        ...state,
        chats: state.chats.map(chat => {
          return chat._id === action.chatId ? {
            ...chat,
            participants: [...chat.participants, action.participant]
          } : chat
        })
      };
    case UPDATE_CHAT_SUCCEEDED:
      return {
        ...state,
        chats: state.chats.map(chat => chat._id === action.chatId ? action.chat : chat)
      };
    case JOIN_CHAT_SUCCEEDED:
      return {
        ...state,
        chats: [...state.chats, action.chat]
      };
    case ADD_MESSAGE:
      return {
        ...state,
        chats: state.chats.map(chat => {
          return chat._id === action.chatId ? { ...chat, messages: [...chat.messages, action.message] } : chat
        })
      };
    case DESTROY_SUCCEEDED:
      return initialState;
    default:
      return state;
  }
}

const persistConfig = {
  key: 'app',
  storage,
  blacklist: ['message']
};

export default persistReducer(persistConfig, app);