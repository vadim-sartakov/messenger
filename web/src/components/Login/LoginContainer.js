import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { login } from '../../actions';
import Login from './Login';

function LoginContainer({ login, ...props }) {
  const history = useHistory();
  const location = useLocation();
  const onSubmit = useCallback(async credentials => {
    const { from } = location.state || { from: { pathname: '/' } };
    const onSuccess = () => history.replace(from);
    login({ credentials, onSuccess });
  }, [history, location.state, login]);
  return <Login {...props} onSubmit={onSubmit} />;
}

function mapDispatchToProps(dispatch) {
  return { login: options => dispatch(login(options)) };
}

export default connect(undefined, mapDispatchToProps)(LoginContainer);