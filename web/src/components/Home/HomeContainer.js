import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  logout,
  clearApp,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClearAll,
  selectChat
} from '../../actions';
import Home from './Home';
import graphqlFetch from '../../utils/graphqlFetch';
import { ME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  data,
  requestGraphqlFetch,
  graphqlFetchClear,
  graphqlSetData,
  clearApp,
  token,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    requestGraphqlFetch('root', ME);
    return () => {
      graphqlFetchClearAll();
      clearApp();
    }
  }, [requestGraphqlFetch, graphqlFetchClear, clearApp]);

  const handleCreateChat = useCallback(async chat => {
    try {
      const response = await graphqlFetch(CREATE_CHAT, { variables: { value: chat }, token });
      graphqlSetData('root', {
        ...data,
        me: {
          ...data.me,
          chats: [...data.me.chats, response.createChat]
        }
      });
    } catch (e) {
      // TODO: Show error message
    }
  }, [graphqlSetData, data, token]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return data.isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      data={data}
      onCreateChat={handleCreateChat}
      onSelectChat={selectChat}
    />
  );
}

const mapStateToProps = state => ({
  token: state.auth.token,
  data: state.graphql.root || { isLoading: true },
  selectedChat: state.app.selectedChat
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query) => dispatch(requestGraphqlFetch(id, query)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  clearApp: () => dispatch(clearApp()),
  selectChat: id => dispatch(selectChat(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);