import { all } from 'redux-saga/effects';
import auth from './auth';
import graphql from './graphql';

export default function* () {
  yield all([
    auth(),
    graphql()
  ]);
}