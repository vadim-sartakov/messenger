import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { requestGraphqlFetch, graphqlSetData, graphqlFetchClear } from '../../../actions';
import { CREATE_CHAT } from '../../../queries';
import ChatList from './ChatList';

function ChatListContainer({
  rootData,
  requestGraphqlFetch,
  graphqlSetData,
  graphqlFetchClear,
  ...props
}) {
  const handleCreateChat = useCallback(chat => {
    const onSuccess = response => {
      graphqlSetData('root', {
        ...rootData,
        me: {
          ...rootData.me,
          chats: [...rootData.me.chats, response.createChat]
        }
      });
    };
    requestGraphqlFetch('createChat', CREATE_CHAT, { variables: { value: chat }, onSuccess, noCache: true });
  }, [requestGraphqlFetch, graphqlSetData, rootData]);

  useEffect(function cleanUp() {
    return () => graphqlFetchClear('createChat');
  }, [graphqlFetchClear]);

  return <ChatList {...props} onCreateChat={handleCreateChat} />;
}

const mapStateToProps = state => ({
  rootData: state.graphql.root
});
const mapDispatchToProps = dispatch => ({
  requestGraphqlFetch: (id, query, options) => dispatch(requestGraphqlFetch(id, query, options)),
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data)),
  graphqlFetchClear: id => dispatch(graphqlFetchClear(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatListContainer);