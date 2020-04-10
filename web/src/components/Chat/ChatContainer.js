import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlFetchClear, graphqlSetData } from '../../actions';
import { CHAT_DETAILS, POST_MESSAGE } from '../../queries';
import Chat from './Chat';
import { WS_URL } from '../../constants';

function ChatContainer({ token, id, me, chat, requestGraphqlFetch, graphqlSetData, graphqlFetchClear, ...props }) {
  const { protocol, hostname, port } = window.location;
  const location = `${protocol}//${hostname}${port.length && ':' + port}`;

  useEffect(() => {
    requestGraphqlFetch('chat', CHAT_DETAILS, { variables: { id } });
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    return () => {
      graphqlFetchClear('chat');
      ws.close();
    }
  }, [id, token, requestGraphqlFetch, graphqlFetchClear]);

  const postMessage = useCallback(({ content }) => {
    const newMessage = { content, author: me, createdAt: new Date() };
    graphqlSetData('chat', {
      chat: {
        ...chat,
        messages: [...chat.messages, newMessage]
      }
    });
    // TODO: The message is lost once page updated. Need to preserve not sent messages.
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
    token: state.auth.token,
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