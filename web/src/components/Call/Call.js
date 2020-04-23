import React, { useEffect, useState, useCallback, useRef } from 'react';
import classNames from 'classnames';
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
import MicVolume from '../../utils/MicVolume';

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
    inputsContainer: {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 350
      }
    },
    marginBottom: {
      marginBottom: theme.spacing(4)
    },
    smallMarginBottom: {
      marginBottom: theme.spacing(1)
    },
    pid: {
      width: 25,
      height: 10,
      border: `solid 1px ${theme.palette.action.disabledBackground}`
    },
    activePid: {
      backgroundColor: theme.palette.primary.main
    },
    videoStream: {
      width: '100%',
      marginBottom: theme.spacing(4)
    }
  };
});

function MicVolumeIndicator({ level }) {
  const classes = useStyles();
  return (
    <Grid
      container
      justify="space-between"
      className={classNames(classes.maxWidth, classes.marginBottom)}
    >
      {[...new Array(10).keys()].map(index => {
        return (
          <div
            key={index}
            className={classNames(
              classes.pid, {
                [classes.activePid]: index < level
              }
            )}
          />
        )
      })}
    </Grid>
  );
}

function Settings({
  audioStream,
  videoStream,
  onGetLocalStream,
  audio,
  video,
  onSubmit,
  showMessage
}) {
  const classes = useStyles();

  const [micVolume, setMicVolume] = useState(0);
  const [cams, setCams] = useState([]);
  const [mics, setMics] = useState([]);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      cam: '',
      mic: ''
    },
    onSubmit
  });
  const { setFieldValue } = formik;

  const handleMicChange = useCallback(mic => {
    setFieldValue('mic', mic);
    onGetLocalStream('audio', mic.deviceId);
  }, [setFieldValue, onGetLocalStream]);

  useEffect(function attachMicVolume() {
    if (!audioStream) return;
    const micVolume = new MicVolume(audioStream, avarage => {
      setMicVolume(Math.round(avarage / 10));
    });
    micVolume.listen();
    return () => micVolume.clear();
  }, [audioStream]);

  const handleCamChange = useCallback(cam => {
    setFieldValue('cam', cam);
    onGetLocalStream('video', cam.deviceId);
  }, [setFieldValue, onGetLocalStream]);

  useEffect(function streamLocalVideo() {
    if (!videoStream) return;
    videoRef.current.srcObject = videoStream;
  }, [videoStream]);

  useEffect(function updateDevices() {
    async function updateMediaDevices() {
      try {
        const constraints = { audio, video };
        // To be able to list all availabel devices it is required to
        // execute getUserMedia first
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach(track => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cams = devices.filter(device => device.kind === 'videoinput');
        const mics = devices.filter(device => device.kind === 'audioinput');
        if (video) {
          setCams(cams);
          handleCamChange(cams[0]);
        }
        if (audio) {
          setMics(mics);
          handleMicChange(mics[0]);
        }
      } catch (err) {
        console.log(err);
        setError(true);
        showMessage({ severity: 'error', text: 'Failed to get camera and microphone data', autoHide: true });
      }
    }
    updateMediaDevices();
    navigator.mediaDevices.addEventListener('devicechange', updateMediaDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', updateMediaDevices);
    }
  }, [audio, video, showMessage, setFieldValue, handleMicChange, handleCamChange]);

  const videoRef = useRef();

  return (
    <form onSubmit={formik.handleSubmit}>
      <Container maxWidth="sm" className={classes.container}>
        <Grid container direction="column" alignItems="center">
          <Typography variant="h5" className={classes.title} align="center">
            {`Check your microphone ${video ? 'and camera ' : ''}settings`}
          </Typography>

          <Grid container direction="column" className={classes.inputsContainer}>
            <FormControl variant="outlined" className={classes.smallMarginBottom} fullWidth>
              <InputLabel id="mic-label">Microphone</InputLabel>
              <Select
                id="mic"
                labelId="mic-label"
                label="Microphone"
                name="mic"
                value={formik.values.mic}
                onChange={e => handleMicChange(e.target.value)}
              >
                {mics.map((mic, index) => {
                  return <MenuItem key={index} value={mic}>{mic.label}</MenuItem>
                })}
              </Select>
            </FormControl>

            <MicVolumeIndicator level={micVolume} />
            
            {video && (
              <>
                <FormControl variant="outlined" className={classes.marginBottom} fullWidth>
                  <InputLabel id="cam-label">Camera</InputLabel>
                  <Select
                    id="cam"
                    labelId="cam-label"
                    label="Camera"
                    name="cam"
                    value={formik.values.cam}
                    onChange={e => handleCamChange(e.target.value)}
                  >
                    {cams.map((cam, index) => {
                      return <MenuItem key={index} value={cam}>{cam.label}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </>
            )}
          </Grid>

          {video && <video ref={videoRef} className={classes.videoStream} autoPlay playsInline controls={false} />}

          <Button
            disabled={error}
            color="primary"
            variant="contained"
            type="submit"
          >
            Join
          </Button>
        </Grid>
      </Container>
    </form>
  )
}

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
  audioStream,
  videoStream,
  onGetLocalStream,
  settings,
  outgoing,
  ongoing,
  onStartCall,
  chat,
  audio,
  video,
  showMessage
}) {
  return (
    <>
      {settings && (
        <Settings
          audioStream={audioStream}
          videoStream={videoStream}
          onGetLocalStream={onGetLocalStream}
          onSubmit={onStartCall}
          audio={audio}
          video={video}
          showMessage={showMessage}
        />
      )}
      {outgoing && <Outgoing chat={chat} />}
      {ongoing && <Ongoing />}
    </>
  );
}

function CallDialog({
  audioStream,
  videoStream,
  onGetLocalStream,
  chat,
  audio,
  video,
  settings,
  outgoing,
  ongoing,
  onStartCall,
  onEndCall,
  showMessage
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
          audioStream={audioStream}
          videoStream={videoStream}
          onGetLocalStream={onGetLocalStream}
          settings={settings}
          outgoing={outgoing}
          ongoing={ongoing}
          onStartCall={onStartCall}
          chat={chat}
          audio={audio}
          video={video}
          showMessage={showMessage}
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