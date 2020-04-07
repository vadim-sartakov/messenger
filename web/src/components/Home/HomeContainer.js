import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { logout, requestGraphqlFetch, graphqlSetData, graphqlFetchClear } from '../../actions';
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
    requestGraphqlFetch('me', ME);
    return () => graphqlFetchClear('me')
  }, [requestGraphqlFetch, graphqlFetchClear]);

  const handleCreateChat = useCallback(chat => {
    graphqlSetData('me', {
      me: {
        ...fetchResult.data.me,
        chats: [...fetchResult.data.me.chats, chat]
      }
    });
    requestGraphqlFetch('createChat', CREATE_CHAT, { value: chat }, true)
  }, [fetchResult.data, graphqlSetData, requestGraphqlFetch]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return fetchResult.isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      onCreateChat={handleCreateChat}
      data={fetchResult.data.me}
    />
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
  fetchResult: state.graphql.me || { isLoading: true, data: {} }
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query, variables, noCahce) => dispatch(requestGraphqlFetch(id, query, variables, noCahce)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);