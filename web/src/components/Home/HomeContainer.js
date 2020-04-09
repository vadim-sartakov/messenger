import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  logout,
  destroyApp,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchDestroy
} from '../../actions';
import Home from './Home';
import { HOME, CREATE_CHAT } from '../../queries';

function HomeContainer({
  logout,
  data,
  requestGraphqlFetch,
  graphqlFetchClear,
  graphqlFetchDestroy,
  graphqlSetData,
  destroyApp,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    requestGraphqlFetch('home', HOME);
    return () => {
      graphqlFetchDestroy();
      destroyApp();
    }
  }, [requestGraphqlFetch, graphqlFetchClear, destroyApp, graphqlFetchDestroy]);

  const handleCreateChat = useCallback(chat => {
    const onSuccess = content => {
      graphqlSetData('home', {
        ...data,
        chats: [...data.chats, content.createChat]
      });
      history.replace({ pathname: `/chats/${content.createChat._id}` });
    };
    requestGraphqlFetch('createChat', CREATE_CHAT, { variables: { value: chat, noCache: true }, onSuccess });
  }, [graphqlSetData, data, requestGraphqlFetch, history]);

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
    />
  );
}

const mapStateToProps = state => ({
  data: state.graphql.home || { isLoading: true }
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  graphqlFetchDestroy: () => dispatch(graphqlFetchDestroy()),
  destroyApp: () => dispatch(destroyApp())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);