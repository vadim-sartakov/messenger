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
import { HOME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  data,
  requestGraphqlFetch,
  graphqlFetchClear,
  graphqlSetData,
  destroyApp,
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

  const handleCreateChat = useCallback(chat => {
    const onSuccess = content => {
      graphqlSetData('home', {
        ...data,
        chats: [...data.chats, content.createChat]
      });
      selectChat(content.createChat._id);
    };
    requestGraphqlFetch('createChat', CREATE_CHAT, { variables: { value: chat, noCache: true }, onSuccess });
  }, [graphqlSetData, data, selectChat, requestGraphqlFetch]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  return data.isLoading ? null : (
    <Home
      {...props}
      location={location}
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
  data: state.graphql.home || { isLoading: true },
  selectedChat: state.app.selectedChat
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  destroyApp: () => dispatch(destroyApp()),
  selectChat: id => dispatch(selectChat(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);