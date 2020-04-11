import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  initialize,
  destroy,
  logOut,
  destroyApp,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchDestroy
} from '../../actions';
import Home from './Home';
import { CREATE_CHAT } from '../../queries';

function HomeContainer({
  initialize,
  destroy,
  logOut,
  isLoading,
  me,
  chats,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    initialize();
    return () => destroy();
  }, [initialize, destroy]);

  const handleLogout = useCallback(() => logOut(history), [history, logOut]);

  /*const handleCreateChat = useCallback(chat => {
    const onSuccess = content => {
      graphqlSetData('home', {
        ...data,
        chats: [...data.chats, content.createChat]
      });
      history.replace({ pathname: `/chats/${content.createChat._id}` });
    };
    requestGraphqlFetch('createChat', CREATE_CHAT, { variables: { value: chat, noCache: true }, onSuccess });
  }, [graphqlSetData, data, requestGraphqlFetch, history]);*/

  return isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      me={me}
      chats={chats}
      //onCreateChat={handleCreateChat}
    />
  );
}

const mapStateToProps = ({ app: { isLoading, me, chats } }) => ({
  isLoading,
  me,
  chats
});
const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(initialize()),
  destroy: () => dispatch(destroy()),
  logOut: history => dispatch(logOut(history)),
  requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  graphqlFetchDestroy: () => dispatch(graphqlFetchDestroy()),
  destroyApp: () => dispatch(destroyApp())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);