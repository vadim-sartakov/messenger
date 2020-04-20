import React, { useEffect, useState, useCallback } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles';
import PhoneIcon from '@material-ui/icons/Phone';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';

const useStyles = makeStyles(theme => {
  return {
    container: {
      marginTop: theme.spacing(6)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  };
});

function Settings() {
  return <div>Camera/mic settings</div>
}

function Outgoing({ chat }) {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        {`Connecting to ${chat.name}...`}
      </Typography>
    </Container>
  )
}

function Incoming({ chat }) {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h4" className={classes.title}>
        {`Incoming call from ${chat.name}`}
      </Typography>
      <Tooltip title="Accept">
        <IconButton>
          <PhoneIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Cancel">
        <IconButton>
          <PhoneDisabledIcon />
        </IconButton>
      </Tooltip>
    </Container>
  )
}

function Ongoing({ settings, onSettingsChange }) {
  const [openSettings, setOpenSettings] = useState(true);

  const handleSettingsSubmit = useCallback(settings => {
    onSettingsChange(settings);
    setOpenSettings(false);
  }, [onSettingsChange]);

  return openSettings ? (
    <Settings settings={settings} onSubmit={handleSettingsSubmit} />
  ) : <div>Ongoing call</div>
}

function Call({ chat, settings, onSettingsChange, incoming, outgoing, ongoing, onEndCall }) {
  useEffect(function alertOnClose() {
    const unload = () => true;
    window.addEventListener('unload', unload);
    return () => window.removeEventListener('unload', unload);
  }, []);

  return (
    <>
      <Dialog
        open={incoming || outgoing || ongoing || false}
        onClose={onEndCall}
        fullScreen
        TransitionComponent={Grow}
      >
        {incoming && <Incoming />}
        {outgoing && <Outgoing chat={chat} />}
        {ongoing && (
          <Ongoing
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        )}
      </Dialog>
    </>
  )
}

export default Call;