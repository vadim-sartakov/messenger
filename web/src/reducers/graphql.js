import {
  GRAPHQL_FETCH_REQUESTED,
  GRAPHQL_FETCH_SUCCEEDED,
  GRAPHQL_FETCH_FAILED,
  GRAPHQL_FETCH_CLEAR
} from '../actions';

const initialState = {};

function clear(state, id) {
  const nextState = { ...state };
  delete nextState[id];
  return nextState;
}

function graphql(state = initialState, { type, id, query, variables, data }) {
  switch (type) {
    case GRAPHQL_FETCH_REQUESTED:
      return { ...state, [id]: { isLoading: true, query, variables } };
    case GRAPHQL_FETCH_SUCCEEDED:
      return { ...state, [id]: data };
    case GRAPHQL_FETCH_FAILED:
      return { ...state, [id]: { error: true } }
    case GRAPHQL_FETCH_CLEAR:
      return clear(state, id);
    default:
      return state;
  }
}

export default graphql;