import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logIn } from '../../actions';
import Login from './Login';

function LoginContainer({ logIn, ...props }) {
  const history = useHistory();
  const location = useLocation();
  const onSubmit = credentials => logIn(credentials, location, history);
  return <Login {...props} onSubmit={onSubmit} />;
}

function mapDispatchToProps(dispatch) {
  return { logIn: (credentials, location, history) => dispatch(logIn(credentials, location, history)) };
}

export default connect(undefined, mapDispatchToProps)(LoginContainer);