import { combineReducers } from 'redux';
import auth from './auth';
import graphql from './graphql';

export default combineReducers({ auth, graphql });