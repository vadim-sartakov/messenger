import { GRAPHQL_FETCH_REQUESTED, GRAPHQL_FETCH_SUCCEEDED, GRAPHQL_FETCH_FAILED } from '../actions';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import graphqlFetchUtil from '../utils/graphqlFetch';

function* graphqlFetch({ id, query, variables, noCache }) {
  const state = yield select();
  const { token } = state.auth;
  let content;
  try {
    content = yield call(graphqlFetchUtil, query, { variables, token });
    yield put({ type: GRAPHQL_FETCH_SUCCEEDED, id, data: content, noCache });
  } catch (error) {
    yield put({ type: GRAPHQL_FETCH_FAILED, id, noCache });
  }
}

function* graphql() {
  yield takeEvery(GRAPHQL_FETCH_REQUESTED, graphqlFetch);
}

export default graphql;