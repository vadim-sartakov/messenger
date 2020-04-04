import { createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';
import saga from './sagas';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

function createStore(preloadedState) {
  const store = reduxCreateStore(reducer, preloadedState, composeEnhancers(
    applyMiddleware(sagaMiddleware)
  ));
  sagaMiddleware.run(saga);  
  return store;
}

export default createStore;