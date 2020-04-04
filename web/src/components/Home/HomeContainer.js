import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions';
import Home from './Home';

function HomeContainer({ logout, ...props }) {
  const history = useHistory();
  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);
  return <Home {...props} logout={handleLogout} />;
}

const mapStateToProps = state => ({
  user: state.auth.user
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);