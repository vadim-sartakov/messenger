import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlFetchClear } from '../../actions';
import { CHAT_DETAILS } from '../../queries';
import Chat from './Chat';

function ChatContainer({ id, chat, requestGraphqlFetch, graphqlFetchClear, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;
  useEffect(() => {
    requestGraphqlFetch('chat', CHAT_DETAILS, { variables: { id } });
    return () => graphqlFetchClear();
  }, [id, requestGraphqlFetch, graphqlFetchClear]);
  return chat.isLoading ? null : <Chat {...props} chat={chat} location={location} />;
}

function mapStateToProps(state) {
  return {
    chat: (state.graphql.chat && state.graphql.chat.chat) || { isLoading: true }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
    graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);