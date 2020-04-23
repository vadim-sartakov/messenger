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
    maxWidth: {
      maxWidth: 300
    },
    minWidth: {
      minWidth: 300
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
  micStream,
  onMicStreamChange,
  camStream,
  onCamStreamChange,
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

  const handleMicChange = useCallback(async mic => {
    setFieldValue('mic', mic);
    const constraints = {
      audio: {
        deviceId: mic.deviceId
      }
    };
    const micStream = await navigator.mediaDevices.getUserMedia(constraints);
    onMicStreamChange(micStream);
  }, [setFieldValue, onMicStreamChange]);

  useEffect(function attachMicVolume() {
    if (!micStream) return;
    const micVolume = new MicVolume(micStream, avarage => {
      setMicVolume(Math.round(avarage / 10));
    });
    micVolume.listen();
    return () => micVolume.clear();
  }, [micStream]);

  const handleCamChange = useCallback(async cam => {
    setFieldValue('cam', cam);
    const constraints = {
      video: {
        deviceId: cam.deviceId
      }
    };
    const camStream = await navigator.mediaDevices.getUserMedia(constraints);
    onCamStreamChange(camStream);
  }, [setFieldValue, onCamStreamChange]);

  useEffect(function streamLocalVideo() {
    if (!camStream) return;
    videoRef.current.srcObject = camStream;
  }, [camStream]);

  useEffect(function updateDevices() {
    async function updateMediaDevices() {
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

          <FormControl variant="outlined" className={classNames(classes.minWidth, classes.smallMarginBottom)}>
            <InputLabel id="mic-label">Microphone</InputLabel>
            <Select
              id="mic"
              labelId="mic-label"
              label="Microphone"
              name="mic"
              value={formik.values.mic}
              onChange={e => handleMicChange(e.target.value)}
              className={classes.maxWidth}
            >
              {mics.map((mic, index) => {
                return <MenuItem key={index} value={mic}>{mic.label}</MenuItem>
              })}
            </Select>
          </FormControl>

          <MicVolumeIndicator level={micVolume} />
          
          {video && (
            <Grid container direction="column" alignItems="center">
              <FormControl variant="outlined" className={classNames(classes.minWidth, classes.marginBottom)}>
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

              <video ref={videoRef} className={classes.videoStream} autoPlay playsInline controls={false} />
            </Grid>
          )}

          <Button
            disabled={error}
            color="primary"
            variant="contained"
            type="submit"
          >
            Join
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
  showMessage
}) {
  const classes = useStyles();
  const [micStream, setMicStream] = useState();
  const [camStream, setCamStream] = useState();
  const [openSettings, setOpenSettings] = useState(true);

  return openSettings ? (
    <Settings
      micStream={micStream}
      onMicStreamChange={setMicStream}
      camStream={camStream}
      onCamStreamChange={setCamStream}
      onSubmit={() => setOpenSettings(false)}
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