import { takeLatest, select, call, put } from 'redux-saga/effects';
import { INITIALIZE_REQUESTED, INITIALIZE_SUCCEEDED, INITIALIZE_FAILED, SHOW_ERROR } from '../actions';
import graphqlFetchUtil from '../utils/graphqlFetch';
import { HOME } from '../queries';
import { GRAPHQL_URL } from '../constants';

function* initialize() {
  const state = yield select();
  const { token } = state.auth;
  let content;
  try {
    content = yield call(graphqlFetchUtil, HOME, { url: GRAPHQL_URL, token });
    yield put({ type: INITIALIZE_SUCCEEDED, data: content.data });
  } catch (error) {
    yield put({ type: INITIALIZE_FAILED });
    yield put({ type: SHOW_ERROR, message: 'Failed to execute request. Please try again later' });
  }
}

export default function* appSaga() {
  yield takeLatest(INITIALIZE_REQUESTED, initialize)
}