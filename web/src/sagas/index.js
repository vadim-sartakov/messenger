import { all } from 'redux-saga/effects';
import auth from './auth';
import app from './app';
import graphql from './graphql';

export default function* () {
  yield all([
    app(),
    auth(),
    graphql()
  ]);
}