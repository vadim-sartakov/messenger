import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, graphqlFetch, graphqlFetchClear } from '../../actions';
import Home from './Home';
import { GET_CHATS_AND_FRIENDS, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  homeData,
  createChatData,
  graphqlFetch,
  graphqlFetchClear,
  ...props
}) {
  const history = useHistory();
  useEffect(() => {
    graphqlFetch('home', GET_CHATS_AND_FRIENDS);
    return () => {
      graphqlFetchClear('home');
      graphqlFetchClear('createChat');
    }
  }, [graphqlFetch, graphqlFetchClear]);

  const handleCreateChat = useCallback(value => {
    graphqlFetch('createChat', CREATE_CHAT, value)
  }, [graphqlFetch]);

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
  graphqlFetch: (id, query) => dispatch(graphqlFetch(id, query)),
  graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);