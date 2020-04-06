import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, requestGraphqlFetch, graphqlFetchClear, graphqlSetData } from '../../actions';
import Home from './Home';
import { ME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  fetchResult,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClear,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    requestGraphqlFetch('home', ME);
    return () => {
      graphqlFetchClear('home');
    }
  }, [requestGraphqlFetch, graphqlFetchClear]);

  const handleCreateChat = useCallback(chat => {
    graphqlSetData({
      me: {
        ...fetchResult.data.me,
        chats: [...fetchResult.data.chats, chat]
      }
    });
    requestGraphqlFetch('home', CREATE_CHAT, chat)
  }, [fetchResult.data, requestGraphqlFetch, graphqlSetData]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return fetchResult.isLoading ? null : (
    <Home
      {...props}
      me={fetchResult.data.me}
      logout={handleLogout}
      createChat={handleCreateChat}
    />
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
  fetchResult: state.graphql.home || { isLoading: true, data: {} }
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query, variables) => dispatch(requestGraphqlFetch(id, query, variables)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);