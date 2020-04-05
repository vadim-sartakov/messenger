import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { graphqlFetch, graphqlFetchClear } from '../../actions';

function withGraphql(id) {
  const mapStateToProps = state => {
    const currentFetch = state.graphql[id];
    return currentFetch ? {
      data: currentFetch.data,
      isLoading: currentFetch.isLoading,
      fetchError: currentFetch.fetchError
    } : {};
  };
  const mapDispatchToProps = dispatch => {
    return {
      graphqlFetch: query => dispatch(graphqlFetch(id, query)),
      graphqlFetchClear: () => dispatch(graphqlFetchClear(id))
    }
  };

  function connector(Component) {
    function GraphqlComponent({ graphqlFetch, graphqlFetchClear, ...props }) {
      useEffect(() => {
        // Cleaning up fetch result on unmount
        return () => graphqlFetchClear()
      }, [graphqlFetchClear]);
      return <Component {...props} graphqlFetch={graphqlFetch} />;
    }
    return connect(mapStateToProps, mapDispatchToProps)(GraphqlComponent);
  }

  return connector; 
}

export default withGraphql;