import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  initialize,
  joinChatNotify,
  destroy,
  logOut
} from '../../actions';
import Home from './Home';
import { GRAPHQL_URL } from '../../constants';
import { JOIN_CHAT } from '../../queries';
import graphqlFetch from '../../utils/graphqlFetch';

function HomeContainer({
  token,
  initialize,
  destroy,
  logOut,
  isLoading,
  me,
  chats,
  joinChatNotify,
  ...props
}) {
  const history = useHistory();
  const { inviteLink } = useParams();

  useEffect(() => {
    initialize();
    return () => destroy();
  }, [initialize, destroy]);

  useEffect(() => {
    if (!inviteLink) return;
    const join = async () => {
      try {
        const response = await graphqlFetch(JOIN_CHAT, { url: GRAPHQL_URL, token, variables: { inviteLink } });
        const chatId = response.data.joinChat._id;
        joinChatNotify(chatId);
        history.replace({ pathname: `/chats/${chatId}` });
      } catch (err) {
        console.log(err);
      }
    }
    join();
  }, [joinChatNotify, inviteLink, token, history]);

  const handleLogout = useCallback(() => logOut(history), [history, logOut]);

  return isLoading ? null : (
    <Home
      {...props}
      logout={handleLogout}
      me={me}
      chats={chats}
    />
  );
}

const mapStateToProps = ({ auth: { token }, app: { isLoading, me, chats } }) => ({
  token,
  isLoading,
  me,
  chats
});
const mapDispatchToProps = dispatch => ({
  initialize: () => dispatch(initialize()),
  destroy: () => dispatch(destroy()),
  logOut: history => dispatch(logOut(history)),
  joinChatNotify: chatId => dispatch(joinChatNotify(chatId))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);