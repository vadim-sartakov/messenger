import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { logIn } from '../actions';

function Login({ logIn }) {
  return (
    <div>
      <div>This is the Login page</div>
      <Button variant="contained" onClick={() => logIn({ name: 'Test' })}>Log In</Button>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return { logIn: user => dispatch(logIn(user)) };
}

const LoginContainer = connect(undefined, mapDispatchToProps)(Login);

export default LoginContainer;