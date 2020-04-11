import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import auth from './auth';
import app from './app';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['app']
};

const rootReducer = combineReducers({
  auth,
  app
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;