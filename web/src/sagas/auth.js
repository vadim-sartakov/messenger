import { takeLatest, call, put, all } from 'redux-saga/effects';
import { AUTH_REQUESTED, AUTH_SUCCEEDED, AUTH_FAILED, LOGOUT_REQUESTED, LOGOUT_SUCCEEDED } from '../actions';

function* authenticate({ credentials, history, from }) {
  const response = yield call(fetch, '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (response.ok) {
    const { token, user } = yield call([response, 'json']);
    yield put({ type: AUTH_SUCCEEDED, token, user });
    history.replace({ pathname: (from && from.pathname) || '/' });
  } else {
    yield put({ type: AUTH_FAILED });
  }
}

function* logout({ history }) {
  yield put({ type: LOGOUT_SUCCEEDED });
  history.replace({ pathname: '/login' });
}

export default function* authSaga() {
  yield all([
    takeLatest(AUTH_REQUESTED, authenticate),
    takeLatest(LOGOUT_REQUESTED, logout)
  ]);
}