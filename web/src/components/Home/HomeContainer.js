import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, requestGraphqlFetch, graphqlFetchClear } from '../../actions';
import Home from './Home';
import { ME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  homeData,
  createChatData,
  requestGraphqlFetch,
  graphqlFetchClear,
  ...props
}) {
  const history = useHistory();
  useEffect(() => {
    requestGraphqlFetch('me', ME);
    return () => {
      graphqlFetchClear('me');
      graphqlFetchClear('createChat');
    }
  }, [requestGraphqlFetch, graphqlFetchClear]);

  const handleCreateChat = useCallback(value => {
    requestGraphqlFetch('createChat', CREATE_CHAT, value)
  }, [requestGraphqlFetch]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return (
    <Home
      {...props}
      homeData={homeData}
      logout={handleLogout}
      createChatData={createChatData}
      createChat={handleCreateChat}
    />
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
  homeData: state.graphql.home,
  createChatData: state.graphql.createChat
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query, variables) => dispatch(requestGraphqlFetch(id, query, variables)),
  graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);