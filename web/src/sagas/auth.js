import { takeLatest, call, put } from 'redux-saga/effects';
import { AUTH_REQUESTED, AUTH_SUCCEEDED, AUTH_FAILED } from '../actions';

function* authenticate({ credentials, history, from }) {
  const response = yield call(fetch, '/login', { method: 'POST', body: JSON.stringify(credentials) });
  if (response.ok) {
    const { token, user } = yield call(response.json);
    yield put({ type: AUTH_SUCCEEDED, token, user });
    history.replace({ pathname: (from && from.pathname) || '/' });
  } else {
    yield put({ type: AUTH_FAILED });
  }
}

export default function* authSaga() {
  yield takeLatest(AUTH_REQUESTED, authenticate);
}