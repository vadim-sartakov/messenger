import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { login } from '../../actions';
import Login from './Login';

function LoginContainer({ token, login, ...props }) {
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/' } };

  useEffect(() => {
    if (token) history.replace(from);
  }, [token, from, history]);

  const onSubmit = credentials => login({ credentials });
  return <Login {...props} onSubmit={onSubmit} />;
}

function mapStateToProps(state) {
  return { token: state.auth.token };
}

function mapDispatchToProps(dispatch) {
  return { login: options => dispatch(login(options)) };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);