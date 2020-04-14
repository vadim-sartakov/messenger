import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  initialize,
  joinChat,
  destroy,
  logOut
} from '../../actions';
import Home from './Home';

function HomeContainer({
  token,
  initialize,
  destroy,
  logOut,
  isLoading,
  me,
  chats,
  joinChat,
  ...props
}) {
  const history = useHistory();
  const { inviteLink } = useParams();

  useEffect(() => {
    initialize();
    return () => destroy();
  }, [initialize, destroy]);

  useEffect(() => {
    if (inviteLink) joinChat(inviteLink, history);
  }, [joinChat, inviteLink, token, history]);

  const handleLogout = useCallback(() => logOut(history), [history, logOut]);

  return (
    <Home
      {...props}
      isLoading={isLoading}
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
  joinChat: (inviteLink, history) => dispatch(joinChat(inviteLink, history))
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);