import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFormik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';

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
    },
    videoStream: {
      width: '100%',
      marginBottom: theme.spacing(4)
    }
  };
});

function Settings({ settings = {}, audio, video, onSettingsChange, onSubmit, showMessage }) {
  const classes = useStyles();

  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      cam: settings.cam || '',
      mic: settings.mic || ''
    },
    onSubmit
  });

  const { setFieldValue } = formik;

  useEffect(function getMediaDevices() {
    async function updateDevices() {
      try {
        const constraints = { audio, video };
        // To be able to list all availabel devices it is required to
        // execute getUserMedia first
        await navigator.mediaDevices.getUserMedia(constraints);
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(device => device.kind === 'videoinput');
        const mics = devices.filter(device => device.kind === 'audioinput');
        if (video) {
          setCams(cams);
          setFieldValue('cam', cams[0]);
        }
        if (audio) {
          setMics(mics);
          setFieldValue('mic', mics[0]);
        }
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
  }, [audio, video, showMessage, setFieldValue]);

  useEffect(function getCameraStream() {
    if (!video || !formik.values.cam.deviceId) return;
    async function getStream() {
      const constraints = {
        video: {
          deviceId: formik.values.cam.deviceId
        }
      };
      const videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = videoStream;
    }
    getStream();
  }, [video, formik.values.cam]);

  const videoRef = useRef();

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container maxWidth="sm" className={classes.container}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" className={classes.title} align="center">
            {`Check your microphone ${video ? 'and camera ' : ''}settings`}
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
            <Grid container direction="column" alignItems="center">
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

              <video ref={videoRef} className={classes.videoStream} autoPlay playsInline controls={false} />
            </Grid>
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