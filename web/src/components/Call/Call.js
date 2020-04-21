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
    inputControl: {
      minWidth: 300,
      marginBottom: theme.spacing(4)
    },
    input: {
      maxWidth: 300
    }
  };
});

function Settings({ settings = {}, audio, video, onSettingsChange, onSubmit, showMessage }) {
  const classes = useStyles();

  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [error, setError] = useState(false);

  useEffect(function getMediaDevices() {
    async function updateDevices() {
      try {
        const constraints = { audio, video };
        await navigator.mediaDevices.getUserMedia(constraints);
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(device => device.kind === 'videoinput');
        const mics = devices.filter(device => device.kind === 'audioinput');
        video && setCams(cams);
        audio && setMics(mics)
      } catch (err) {
        console.log(err);
        setError(true);
        showMessage({ severity: 'error', text: 'Failed to get camera and microphone data', autoHide: true });
      }
    }
    updateDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateDevices);
    }
  }, [audio, video, showMessage]);

  const handleCameraChange = camera => {
    console.log('camera = %o', camera);
  };
  const handleMicrophoneChange = mic => {
    console.log('mic = %o', mic);
  };
  const formik = useFormik({
    initialValues: {
      cam: settings.cam || '',
      mic: settings.mic || ''
    },
    onSubmit
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Container maxWidth="sm" className={classes.container}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" className={classes.title} align="center">
            Check your microphone and camera settings
          </Typography>

          <FormControl variant="outlined" className={classes.inputControl}>
            <InputLabel id="mic-label">Microphone</InputLabel>
            <Select
              id="mic"
              labelId="mic-label"
              label="Microphone"
              name="mic"
              value={formik.values.mic}
              onChange={formik.handleChange}
              className={classes.input}
            >
              {mics.map((mic, index) => {
                return <MenuItem key={index} value={mic}>{mic.label}</MenuItem>
              })}
            </Select>
          </FormControl>
          
          {video && (
            <FormControl variant="outlined" className={classes.inputControl}>
              <InputLabel id="cam-label">Camera</InputLabel>
              <Select
                id="cam"
                labelId="cam-label"
                label="Camera"
                name="cam"
                value={formik.values.cam}
                onChange={formik.handleChange}
              >
                {cams.map((cam, index) => {
                  return <MenuItem key={index} value={cam}>{cam.label}</MenuItem>
                })}
              </Select>
            </FormControl>
          )}

          <Button
            disabled={error}
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

function Outgoing({
  chat,
  audio,
  video,
  settings,
  onSettingsChange,
  showMessage
}) {
  const classes = useStyles();
  const [openSettings, setOpenSettings] = useState(true);

  const handleSettingsSubmit = useCallback(settings => {
    onSettingsChange(settings);
    setOpenSettings(false);
  }, [onSettingsChange]);

  return openSettings ? (
    <Settings
      settings={settings}
      onSubmit={handleSettingsSubmit}
      audio={audio}
      video={video}
      showMessage={showMessage}
    />
  ) : (
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

function Call({
  chat,
  audio,
  video,
  settings,
  onSettingsChange,
  outgoing,
  ongoing,
  onEndCall,
  showMessage
}) {
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
            audio={audio}
            video={video}
            showMessage={showMessage}
          />
        )}
        {ongoing && <Ongoing onSettingsChange={onSettingsChange} />}
      </Dialog>
    </>
  )
}

export default Call;