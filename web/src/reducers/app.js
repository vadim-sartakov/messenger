import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {
  INITIALIZE_REQUESTED,
  INITIALIZE_SUCCEEDED,
  INITIALIZE_FAILED,
  SHOW_MESSAGE,
  HIDE_MESSAGE,
  CREATE_CHAT_SUCCEEDED,
  RENAME_CHAT_SUCCEEDED,
  ADD_CHAT_PARTICIPANT,
  DESTROY_SUCCEEDED,
  POST_MESSAGE_SUCCEEDED,
  SWITCH_THEME_TYPE
} from '../actions';

const initialState = { isLoading: true, darkMode: false };

function app(state = initialState, { type, ...action }) {
  switch (type) {
    case INITIALIZE_REQUESTED:
      return { ...state, isLoading: true };
    case INITIALIZE_SUCCEEDED:
      return { ...state, isLoading: false, initialized: true, me: action.data.me, chats: action.data.chats };
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
    case RENAME_CHAT_SUCCEEDED:
      return {
        ...state,
        chats: state.chats.map(chat => chat._id === action.chatId ? { ...chat, name: action.name } : chat)
      };
    case POST_MESSAGE_SUCCEEDED:
      return {
        ...state,
        chats: state.chats.map(chat => {
          return chat._id === action.chatId ? { ...chat, messages: [...chat.messages, action.message] } : chat
        })
      };
    case SWITCH_THEME_TYPE:
      return { ...state, darkMode: !state.darkMode };
    case DESTROY_SUCCEEDED:
      return { isLoading: true, darkMode: state.darkMode };
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