import { createStore as reduxCreateStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducers';

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

function createStore(preloadedState) {
  return reduxCreateStore(reducer, preloadedState, composeEnhancers(
    applyMiddleware(sagaMiddleware)
  ));
}

export default createStore;