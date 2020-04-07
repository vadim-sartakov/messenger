import {
  GRAPHQL_FETCH_REQUESTED,
  GRAPHQL_FETCH_SUCCEEDED,
  GRAPHQL_FETCH_FAILED,
  GRAPHQL_FETCH_CLEAR,
  GRAPHQL_SET_DATA
} from '../actions';

const initialState = {};

function clear(state, id) {
  const nextState = { ...state };
  delete nextState[id];
  return nextState;
}

function graphql(state = initialState, { type, id, query, variables, data, noCache }) {
  switch (type) {
    case GRAPHQL_FETCH_REQUESTED:
      return { ...state, [id]: { ...state[id], isLoading: true, query, variables, noCache, data: {} } };
    case GRAPHQL_FETCH_SUCCEEDED:
      return noCache ? clear(state, id) : { ...state, [id]: data };
    case GRAPHQL_FETCH_FAILED:
      return noCache ? clear(state, id) : { ...state, [id]: { ...state[id], error: true, isLoading: false } }
    case GRAPHQL_SET_DATA:
      return { ...state, [id]: { ...state[id], data } }
    case GRAPHQL_FETCH_CLEAR:
      return clear(state, id);
    default:
      return state;
  }
}

export default graphql;