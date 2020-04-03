import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { logIn } from '../actions';

function Login({ logIn }) {
  const history = useHistory();
  const location = useLocation();

  const handleLogin = () => {
    const { from } = location.state || { from: { pathname: "/" } };
    logIn({ name: 'Test' });
    history.replace(from);
  };

  return (
    <div>
      <div>This is the Login page</div>
      <Button
        color="primary"
        variant="contained"
        onClick={handleLogin}
      >
          Log In
      </Button>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return { logIn: user => dispatch(logIn(user)) };
}

const LoginContainer = connect(undefined, mapDispatchToProps)(Login);

export default LoginContainer;