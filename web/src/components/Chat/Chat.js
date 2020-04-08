import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import EmptyChat from './EmptyChat';

const useStyles = makeStyles(theme => {
  return {
    container: {
      height: '100%'
    },
    innerContainer: {
      height: '100%'
    },
    messeges: {
      overflow: 'auto',
      flexGrow: 1
    },
    message: {
      position: 'sticky',
      bottom: theme.spacing(2)
    }
  };
});

function Chat({ chat, location }) {
  const classes = useStyles();
  return chat.participants.length === 0 ? <EmptyChat chat={chat} location={location} /> : (
    <Container maxWidth="sm" className={classes.container}>
      <Grid container direction="column" className={classes.innerContainer}>
        <div className={classes.messeges}>

        </div>
        <TextField
          id="message"
          className={classes.message}
          placeholder="Type a message"
          variant="outlined"
          multiline
          fullWidth
        />
      </Grid>
    </Container>
  );
}

export default Chat;