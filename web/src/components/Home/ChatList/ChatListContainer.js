import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlSetData } from '../../../actions';
import ChatList from './ChatList';
import { GET_CHATS, CREATE_CHAT } from '../../../queries';

function ChatListContainer({
  fetchResult,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClear,
  ...props
}) {
  useEffect(() => {
    requestGraphqlFetch('chats', GET_CHATS);
  }, [requestGraphqlFetch, graphqlFetchClear]);

  const handleCreateChat = useCallback(chat => {
    graphqlSetData('chats', {
      chats: [...fetchResult.data.chats, chat]
    });
    requestGraphqlFetch('home', CREATE_CHAT, { value: chat })
  }, [fetchResult.data, requestGraphqlFetch, graphqlSetData]);

  return fetchResult.isLoading ? null : (
    <ChatList
      {...props}
      chats={fetchResult.data.chats}
      onCreateChat={handleCreateChat}
    />
  );
}

const mapStateToProps = state => ({
  fetchResult: state.graphql.chats || { isLoading: true, data: {} }
});
const mapDispatchToProps = dispatch => ({
  requestGraphqlFetch: (id, query, variables) => dispatch(requestGraphqlFetch(id, query, variables)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatListContainer);