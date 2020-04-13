import { createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore } from 'redux-persist';
import reducer from './reducers';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (
  typeof window !== 'undefined' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 })
) || compose;

function createStore(preloadedState) {
  const store = reduxCreateStore(reducer, preloadedState, composeEnhancers(
    applyMiddleware(sagaMiddleware)
  ));
  const persistor = persistStore(store);
  sagaMiddleware.run(saga);  
  return { store, persistor };
}

export default createStore;