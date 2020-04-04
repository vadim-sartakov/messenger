import { createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import reducer from './reducers';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const persistConfig = {
  key: 'state',
  storage
};

const persistedReducer = persistReducer(persistConfig, reducer);

function createStore(preloadedState, persist) {
  const store = reduxCreateStore(persist ? persistedReducer : reducer, preloadedState, composeEnhancers(
    applyMiddleware(sagaMiddleware)
  ));
  const persistor = persistStore(store);
  sagaMiddleware.run(saga);  
  return persist ? { store, persistor } : store;
}

export default createStore;