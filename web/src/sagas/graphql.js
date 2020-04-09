import { GRAPHQL_FETCH_REQUESTED, GRAPHQL_FETCH_SUCCEEDED, GRAPHQL_FETCH_FAILED, SHOW_ERROR } from '../actions';
import { takeEvery, select, call, put } from 'redux-saga/effects';
import graphqlFetchUtil from '../utils/graphqlFetch';

function* graphqlFetch({ id, query, variables, noCache, onSuccess, onError }) {
  const state = yield select();
  const { token } = state.auth;
  let content;
  try {
    content = yield call(graphqlFetchUtil, query, { variables, token });
    if (content.errors) {
      yield put({ type: GRAPHQL_FETCH_FAILED, id, noCache, data: content.errors });
      onError && onError(content.errors);
    } else {
      yield put({ type: GRAPHQL_FETCH_SUCCEEDED, id, noCache, data: content.data });
      onSuccess && onSuccess(content.data);
    }
  } catch (error) {
    yield put({ type: GRAPHQL_FETCH_FAILED, id, noCache, data: content.errors });
    yield put({ type: SHOW_ERROR, message: 'Failed to execute request. Please try again later' });
  }
}

function* graphql() {
  yield takeEvery(GRAPHQL_FETCH_REQUESTED, graphqlFetch);
}

export default graphql;