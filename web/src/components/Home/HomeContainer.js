import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  initialize,
  destroy,
  logOut,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchDestroy
} from '../../actions';
import Home from './Home';

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

  return isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      me={me}
      chats={chats}
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
  graphqlFetchDestroy: () => dispatch(graphqlFetchDestroy())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);