import { takeLatest, call, put, all, delay, select } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/es/constants'
import {
  AUTH_REQUESTED,
  AUTH_SUCCEEDED,
  AUTH_FAILED,
  TOKEN_EXPIRED
} from '../actions';

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

function* authorize({ credentials, onSuccess, onError }) {
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
    onSuccess && onSuccess();
  } else {
    yield put({ type: AUTH_FAILED });
    onError && onError();
  }
}

export default function* authSaga() {
  yield all([
    takeLatest([REHYDRATE, AUTH_SUCCEEDED], watchTokenExpiration),
    takeLatest(AUTH_REQUESTED, authorize)
  ]);
}