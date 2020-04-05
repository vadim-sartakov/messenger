import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions';
import Home from './Home';
import withGraphql from '../withGraphql';
import { GET_OVERVIEW } from '../../queries';

function HomeContainer({ logout, graphqlFetch, ...props }) {
  const history = useHistory();
  useEffect(() => {
    graphqlFetch(GET_OVERVIEW);
  }, [graphqlFetch]);
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

const WithGraphql = withGraphql('messenger')(HomeContainer);

export default connect(mapStateToProps, mapDispatchToProps)(WithGraphql);