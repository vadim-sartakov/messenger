import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlFetchClear, graphqlSetData } from '../../actions';
import { CHAT_DETAILS, POST_MESSAGE } from '../../queries';
import Chat from './Chat';

function ChatContainer({ id, me, chat, requestGraphqlFetch, graphqlSetData, graphqlFetchClear, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  useEffect(() => {
    requestGraphqlFetch('chat', CHAT_DETAILS, { variables: { id } });
    return () => graphqlFetchClear();
  }, [id, requestGraphqlFetch, graphqlFetchClear]);

  const postMessage = useCallback(({ content }) => {
    const newMessage = { content, author: me, createdAt: new Date() };
    graphqlSetData('chat', {
      chat: {
        ...chat,
        messages: [...chat.messages, newMessage]
      }
    });
    const onError = () => {
      graphqlSetData('chat', {
        chat: {
          ...chat,
          messages: [...chat.messages, { ...newMessage, notSent: true }]
        }
      });
    };
    requestGraphqlFetch('postMessage', POST_MESSAGE, { variables: { chat: id, content }, onError, noCache: true });
  }, [id, me, chat, requestGraphqlFetch, graphqlSetData]);

  return chat.isLoading ? null : <Chat {...props} chat={chat} location={location} postMessage={postMessage} />;
}

function mapStateToProps(state) {
  return {
    me: state.graphql.home.me,
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