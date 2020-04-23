import { all } from 'redux-saga/effects';
import auth from './auth';
import app from './app';
import call from './call';

export default function* () {
  yield all([
    app(),
    auth(),
    call()
  ]);
}