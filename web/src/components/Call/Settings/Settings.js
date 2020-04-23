import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

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
  mics = [],
  cams = [],
  micVolume,
  videoStream,
  video,
  value,
  onMicChange,
  onCamChange,
  onSubmit
}) {
  const classes = useStyles();
  const videoRef = useRef();
  useEffect(function streamLocalVideo() {
    if (!video) return;
    videoRef.current.srcObject = videoStream;
  }, [video, videoStream]);
  return (
    <form onSubmit={onSubmit}>
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
                value={value.mic}
                onChange={e => onMicChange(e.target.value)}
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
                    value={value.cam}
                    onChange={e => onCamChange(e.target.value)}
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

export default Settings;