import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlFetchClear, graphqlSetData } from '../../actions';
import { CHAT_DETAILS, POST_MESSAGE } from '../../queries';
import Chat from './Chat';

function ChatContainer({ id, chat, requestGraphqlFetch, graphqlSetData, graphqlFetchClear, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  useEffect(() => {
    requestGraphqlFetch('chat', CHAT_DETAILS, { variables: { id } });
    return () => graphqlFetchClear();
  }, [id, requestGraphqlFetch, graphqlFetchClear]);

  const postMessage = useCallback(({ content }) => {
    graphqlSetData('chat', {
      chat: {
        ...chat,
        messages: [...chat.messages, { content }]
      }
    });
    requestGraphqlFetch('postMessage', POST_MESSAGE, { variables: { chat: id, content }, noCache: true });
  }, [id, chat, requestGraphqlFetch, graphqlSetData]);

  return chat.isLoading ? null : <Chat {...props} chat={chat} location={location} postMessage={postMessage} />;
}

function mapStateToProps(state) {
  return {
    chat: (state.graphql.chat && state.graphql.chat.chat) || { isLoading: true }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
    graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
    graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer);