import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions';
import Home from './Home';

function HomeContainer(props) {
  const history = useHistory();
  const handleLogout = useCallback(async () => {
    const response = await fetch('/logout', { method: 'POST' });
    if (response.ok) {
      logout();
      history.replace({ pathname: '/' });
    }
  }, [history]);
  return <Home {...props} logout={handleLogout} />;
}

const mapStateToProps = state => ({ user: state.auth.user });
const mapDispatchToProps = dispatch => ({ logout: () => dispatch(logout()) });

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);