import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { graphqlSetData } from '../../../actions';
import { CREATE_CHAT } from '../../../queries';
import graphqlFetch from '../../../utils/graphqlFetch';
import ChatList from './ChatList';

function ChatListContainer({
  token,
  rootData,
  graphqlSetData,
  ...props
}) {
  const handleCreateChat = useCallback(async chat => {
    try {
      const response = await graphqlFetch(CREATE_CHAT, { variables: { value: chat }, token });
      graphqlSetData('root', {
        ...rootData,
        me: {
          ...rootData.me,
          chats: [...rootData.me.chats, response.createChat]
        }
      });
    } catch (e) {
      // TODO: Show error message
    }
  }, [graphqlSetData, rootData, token]);

  return <ChatList {...props} onCreateChat={handleCreateChat} />;
}

const mapStateToProps = state => ({
  token: state.auth.token,
  rootData: state.graphql.root
});
const mapDispatchToProps = dispatch => ({
  graphqlSetData: (id, data) => dispatch(graphqlSetData(id, data))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatListContainer);