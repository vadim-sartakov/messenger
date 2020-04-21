import React, { useEffect, useState, useCallback } from 'react';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import PhoneIcon from '@material-ui/icons/Phone';
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';

const useStyles = makeStyles(theme => {
  return {
    container: {
      marginTop: theme.spacing(8)
    },
    title: {
      marginBottom: theme.spacing(4)
    },
    closeButton: {
      position: 'fixed',
      top: theme.spacing(1),
      right: theme.spacing(1)
    },
    input: {
      minWidth: 300,
      marginBottom: theme.spacing(4)
    }
  };
});

function Settings({ settings = {}, onSettingsChange, onSubmit }) {
  const classes = useStyles();
  const handleCameraChange = camera => {
    console.log('camera = %o', camera);
  };
  const handleMicrophoneChange = mic => {
    console.log('mic = %o', mic);
  };
  const formik = useFormik({
    initialValues: {
      camera: '',
      mic: ''
    },
    onSubmit
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <Container maxWidth="sm" className={classes.container}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" className={classes.title} align="center">
            Check your microphone and camera settings
          </Typography>
          
          <FormControl variant="outlined" className={classes.input}>
            <InputLabel id="cam-label">Camera</InputLabel>
            <Select
              id="camera"
              labelId="cam-label"
              label="Camera"
              name="camera"
              value={formik.values.camera}
              onChange={formik.handleChange}
            >
              <MenuItem value="Camera 1">Camera 1</MenuItem>
              <MenuItem value="Camera 2">Camera 2</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" className={classes.input}>
            <InputLabel id="mic-label">Microphone</InputLabel>
            <Select
              id="mic"
              labelId="mic-label"
              label="Microphone"
              name="mic"
              value={formik.values.mic}
              onChange={formik.handleChange}
            >
              <MenuItem value="Microphone 1">Microphone 1</MenuItem>
              <MenuItem value="Microphone 2">Microphone 2</MenuItem>
            </Select>
          </FormControl>

          <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Connect
          </Button>
        </Grid>
        <IconButton className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </Container>
    </form>
  )
}

function Outgoing({ chat, settings, onSettingsChange }) {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState(true);

  const handleSettingsSubmit = useCallback(settings => {
    onSettingsChange(settings);
    setOpenSettings(false);
  }, [onSettingsChange]);

  return openSettings ? <Settings settings={settings} onSubmit={handleSettingsSubmit} /> : (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h5" className={classes.title}>
        {`Connecting to ${chat.name}...`}
      </Typography>
    </Container>
  )
}

function Ongoing() {
  return <div>Ongoing call</div>;
}

function Call({ chat, settings, onSettingsChange, outgoing, ongoing, onEndCall }) {
  useEffect(function alertOnClose() {
    const unload = () => true;
    window.addEventListener('unload', unload);
    return () => window.removeEventListener('unload', unload);
  }, []);

  return (
    <>
      <Dialog
        open={outgoing || ongoing || false}
        onClose={onEndCall}
        fullScreen
        TransitionComponent={Grow}
      >
        {outgoing && (
          <Outgoing
            settings={settings}
            chat={chat}
          />
        )}
        {ongoing && <Ongoing onSettingsChange={onSettingsChange} />}
      </Dialog>
    </>
  )
}

export default Call;