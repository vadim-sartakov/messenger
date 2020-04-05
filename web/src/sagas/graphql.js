import { GRAPHQL_FETCH_REQUESTED, GRAPHQL_FETCH_SUCCEEDED, GRAPHQL_FETCH_FAILED } from '../actions';
import { takeEvery, select, call, put } from 'redux-saga/effects';

function* graphqlFetch({ id, query, variables }) {
  const state = yield select();
  const { token } = state.auth;
  const response = yield call(
    fetch,
    '/graphql',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ query, variables })
    }
  );
  if (response.ok) {
    const content = yield call([response, 'json']);
    if (content.errors) {
      yield put({ type: GRAPHQL_FETCH_FAILED, id });
    } else {
      yield put({ type: GRAPHQL_FETCH_SUCCEEDED, id, data: content });
    }
  } else {
    yield put({ type: GRAPHQL_FETCH_FAILED, id });
  }
}

function* graphql() {
  yield takeEvery(GRAPHQL_FETCH_REQUESTED, graphqlFetch);
}

export default graphql;