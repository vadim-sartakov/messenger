import React, { useState, useRef } from 'react';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import CopyIcon from '@material-ui/icons/Save';
import InputAdornment from '@material-ui/core/InputAdornment';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  subtitle: {
    marginBottom: theme.spacing(1)
  }
}));

function EmptyChat({ chat, location }) {
  const classes = useStyles();
  const inputRef = useRef();
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    inputRef.current.select();
    document.execCommand('copy');
  };
  return (
    <Container maxWidth="sm">
      <Paper className={classes.paper}>
        <Grid container direction="column">
          <Typography variant="h5" className={classes.title}>
            No one invited yet...
          </Typography>
          <Typography variant="subtitle1" className={classes.subtitle}>
            Share this link with others for invite:
          </Typography>
          <TextField
            variant="outlined"
            value={`${location}/${chat.inviteLink}`}
            fullWidth
            InputProps={{
              inputRef,
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip
                    title={copied ? 'Copied!' : 'Copy'}
                    onTransitionEnd={() => setCopied(false)}
                  >
                    <IconButton
                      color="primary"
                      onClick={handleCopy}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Paper>
    </Container>
  )
}

export default EmptyChat;