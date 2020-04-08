import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { requestGraphqlFetch, graphqlFetchClear, selectChat } from '../../actions';
import { JOIN_CHAT } from '../../queries';
import JoinChat from './JoinChat';

function JoinChatContainer({ requestGraphqlFetch, graphqlFetchClear, selectChat, error }) {
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    const onSuccess = content => {
      selectChat(content.joinChat._id);
      history.replace({ pathname: '/' });
    }
    requestGraphqlFetch('joinChat', JOIN_CHAT, { variables: { inviteLink: id }, onSuccess });
    return () => graphqlFetchClear('joinChat');
  }, [id, requestGraphqlFetch, graphqlFetchClear, selectChat, history]);
  return <JoinChat error={error} />;
}

function mapStateToProps(state) {
  return { error: state.graphql.joinChat && state.graphql.joinChat.error };
}

function mapDispatchToProps(dispatch) {
  return {
    requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
    graphqlFetchClear: id => dispatch(graphqlFetchClear(id)),
    selectChat: id => dispatch(selectChat(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinChatContainer);