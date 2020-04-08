import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { requestGraphqlFetch, graphqlFetchClear } from '../../actions';
import { JOIN_CHAT } from '../../queries';
import JoinChat from './JoinChat';

function JoinChatContainer({ requestGraphqlFetch, graphqlFetchClear, error }) {
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    const onSuccess = () => history.replace({ pathname: '/' });
    requestGraphqlFetch('joinChat', JOIN_CHAT, { onSuccess });
    return () => graphqlFetchClear('joinChat');
  }, [id, requestGraphqlFetch, graphqlFetchClear, history]);
  return <JoinChat error={error} />;
}

function mapStateToProps(state) {
  return { error: state.graphql.joinChat.error };
}

function mapDispatchToProps(dispatch) {
  return {
    requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
    graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinChatContainer);