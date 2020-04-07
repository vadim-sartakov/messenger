import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  logout,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClearAll
} from '../../actions';
import Home from './Home';
import { ME } from '../../queries';

function HomeContainer({
  logout,
  data,
  requestGraphqlFetch,
  graphqlFetchClear,
  ...props
}) {
  const history = useHistory();

  useEffect(() => {
    requestGraphqlFetch('root', ME);
    return () => {
      graphqlFetchClearAll();
    }
  }, [requestGraphqlFetch, graphqlFetchClear]);

  const handleLogout = useCallback(() => {
    logout(history);
    history.replace({ pathname: '/' });
  }, [history, logout]);

  return data.isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      data={data}
    />
  );
}

const mapStateToProps = state => ({
  data: state.graphql.root || { isLoading: true },
  selectedChat: state.app.selectedChat
});
const mapDispatchToProps = dispatch => ({
  logout: history => dispatch(logout(history)),
  requestGraphqlFetch: (id, query) => dispatch(requestGraphqlFetch(id, query)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);