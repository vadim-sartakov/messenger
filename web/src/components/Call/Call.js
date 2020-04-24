import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import Settings from './Settings';

const useStyles = makeStyles(theme => {
  return {
    container: {
      marginTop: theme.spacing(8)
    },
    closeButton: {
      position: 'fixed',
      top: theme.spacing(1),
      right: theme.spacing(1)
    }
  };
});

function Outgoing({ chat }) {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        {`Connecting to ${chat.name}...`}
      </Typography>
    </Container>
  );
}

function Ongoing() {
  return <div>Ongoing call</div>;
}

function Call({
  settings,
  outgoing,
  ongoing,
  chat
}) {
  return (
    <>
      {settings && <Settings />}
      {outgoing && <Outgoing chat={chat} />}
      {ongoing && <Ongoing />}
    </>
  );
}

function CallDialog({
  chat,
  settings,
  outgoing,
  ongoing,
  onEndCall
}) {
  const classes = useStyles();
  useEffect(function alertOnClose() {
    const unload = () => true;
    window.addEventListener('unload', unload);
    return () => window.removeEventListener('unload', unload);
  }, []);
  const open = settings || outgoing || ongoing || false;
  return (
    <>
      <Dialog
        open={open}
        fullScreen
        TransitionComponent={Grow}
      >
        <Call
          settings={settings}
          outgoing={outgoing}
          ongoing={ongoing}
          chat={chat}
        />
        <IconButton
          className={classes.closeButton}
          onClick={onEndCall}
        >
          <CloseIcon />
        </IconButton>
      </Dialog>
    </>
  )
}

export default CallDialog;