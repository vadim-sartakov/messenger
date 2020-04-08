import React from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import EmptyChat from './EmptyChat';

const useStyles = makeStyles(theme => {
  return {
    container: {
      height: `calc(100vh - ${theme.mixins.toolbar.minHeight + theme.spacing(8)}px)`
    },
    message: {
      position: 'sticky',
      bottom: 20
    }
  };
});

function Chat({ chat, location }) {
  const classes = useStyles();
  return chat.participants.length === 0 ? <EmptyChat chat={chat} location={location} /> : (
    <Container maxWidth="sm" disableGutters className={classes.container}>
      <TextField
        id="message"
        className={classes.message}
        placeholder="Type a message"
        variant="outlined"
        multiline
        fullWidth
      />
    </Container>
  );
}

export default Chat;