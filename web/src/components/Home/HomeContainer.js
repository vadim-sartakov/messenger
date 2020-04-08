import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  logout,
  destroyApp,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClearAll,
  selectChat
} from '../../actions';
import Home from './Home';
import graphqlFetch from '../../utils/graphqlFetch';
import { HOME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  data,
  requestGraphqlFetch,
  graphqlFetchClear,
  graphqlSetData,
  destroyApp,
  token,
  selectedChat,
  selectChat,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    requestGraphqlFetch('home', HOME);
    return () => {
      graphqlFetchClearAll();
      destroyApp();
    }
  }, [requestGraphqlFetch, graphqlFetchClear, destroyApp]);

  const handleCreateChat = useCallback(async chat => {
    try {
      const response = await graphqlFetch(CREATE_CHAT, { variables: { value: chat }, token });
      graphqlSetData('home', {
        ...data,
        chats: [...data.chats, response.createChat]
      });
      selectChat(response.createChat._id);
    } catch (e) {
      // TODO: Show error message
    }
  }, [graphqlSetData, data, token, selectChat]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return data.isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      me={data.me}
      chats={data.chats}
      onCreateChat={handleCreateChat}
      selectedChat={selectedChat}
      onSelectChat={selectChat}
    />
  );
}

const mapStateToProps = state => ({
  token: state.auth.token,
  data: state.graphql.home || { isLoading: true },
  selectedChat: state.app.selectedChat
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query) => dispatch(requestGraphqlFetch(id, query)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  destroyApp: () => dispatch(destroyApp()),
  selectChat: id => dispatch(selectChat(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);