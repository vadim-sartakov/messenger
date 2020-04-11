import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { JOIN_CHAT } from '../../queries';
import graphqlFetch from '../../utils/graphqlFetch';
import JoinChat from './JoinChat';
import { GRAPHQL_URL } from '../../constants';

function JoinChatContainer({ token }) {
  const { id } = useParams();
  const history = useHistory();
  const [error, setError] = useState(false);
  useEffect(() => {
    const join = async () => {
      try {
        const response = await graphqlFetch(JOIN_CHAT, { url: GRAPHQL_URL, token, variables: { inviteLink: id } });
        history.replace({ pathname: `/chats/${response.data.joinChat._id}` });
      } catch (err) {
        setError(true);
      }
    }
    join();
  }, [id, token, history]);
  return <JoinChat error={error} />;
}

function mapStateToProps(state) {
  return { token: state.auth.token };
}

export default connect(mapStateToProps)(JoinChatContainer);