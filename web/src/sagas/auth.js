import { takeLatest, call, put, all, delay, select } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/es/constants'
import {
  LOGIN_REQUESTED,
  LOGIN_SUCCEEDED,
  LOGIN_FAILED,
  LOGOUT_REQUESTED,
  LOGOUT_SUCCEEDED,
  TOKEN_EXPIRED,
  SHOW_MESSAGE
} from '../actions';
import { API_URL } from '../constants';

function* watchTokenExpiration() {
  const state = yield select();
  const { token } = state.auth;
  if (!token) return;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expMs = payload.exp * 1000;
  const curMs = new Date().getTime();
  const validFor = expMs - curMs;
  yield delay(validFor);
  yield put({ type: TOKEN_EXPIRED });
}

function* logout({ history }) {
  yield put({ type: LOGOUT_SUCCEEDED });
  yield call([history, 'replace'], { pathname: '/' });
}

function* authorize({ credentials, location, history }) {
  const response = yield call(fetch, `${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });
  if (response.ok) {
    const { token } = yield call([response, 'json']);
    yield put({ type: LOGIN_SUCCEEDED, token });
    const { from } = location.state || { from: { pathname: '/' } };
    yield call([history, 'replace'], from);
  } else {
    yield put({ type: LOGIN_FAILED });
    yield put({ type: SHOW_MESSAGE, severity: 'error', text: 'Failed to execute request. Please try again later' });
  }
}

export default function* authSaga() {
  yield all([
    takeLatest([REHYDRATE, LOGIN_SUCCEEDED], watchTokenExpiration),
    takeLatest(LOGIN_REQUESTED, authorize),
    takeLatest(LOGOUT_REQUESTED, logout)
  ]);
}