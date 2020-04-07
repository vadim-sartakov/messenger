import { combineReducers } from 'redux';
import auth from './auth';
import graphql from './graphql';
import app from './app';

export default combineReducers({ auth, graphql, app });