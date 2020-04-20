import React, { useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SendIcon from '@material-ui/icons/Send';
import VideoIcon from '@material-ui/icons/Videocam';
import CallIcon from '@material-ui/icons/Call';
import { Formik } from 'formik';
import InputTextField from '../ui/InputTextField';
import EmptyChat from './EmptyChat';
import Message from './Message';
import { isRequired } from '../../utils/validators';

const useStyles = makeStyles(theme => {
  return {
    container: {
      overflow: 'auto',
      height: '100%'
    },
    messagesContainer: {
      flexGrow: 1,
      padding: `0 ${theme.spacing(3)}px`,
      width: '100%'
    },
    message: {
      marginBottom: theme.spacing(2)
    },
    bottomPanel: {
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
      width: '100%',
      backgroundColor: theme.palette.type === 'dark' ? theme.palette.background.default : '#fff',
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
      display: 'flex',
      justifyContent: 'center'
    },
    inputContainer: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: theme.breakpoints.values.sm
      }
    },
    actions: {
      flex: '1 0',
      display: 'flex',
      marginLeft: theme.spacing(1)
    }
  };
});

const inputInitialValues = { content: '' };

function validate({ content }) {
  return !isRequired(content) ? { content: 'Type a message' } : {};
}

function InputMessage({ onSubmit }) {
  const handleSubmit = (value, { resetForm }) => {
    onSubmit(value);
    resetForm();
  };
  const inputRef = useRef();
  useEffect(function focusInput() {
    inputRef.current.focus();
  }, []);
  return (
    <Formik
      initialValues={inputInitialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit }) => {
        const handleKeyDown = event => {
          if (event.ctrlKey && event.key === 'Enter') {
            handleSubmit();
          }
        }
        return (
          <InputTextField
            ignoreError
            id="content"
            name="content"
            placeholder="Type a message"
            variant="outlined"
            multiline
            fullWidth
            onKeyDown={handleKeyDown}
            InputProps={{
              inputRef,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Send" placement="top" arrow PopperProps={{ disablePortal: true }}>
                    <IconButton color="primary" onClick={handleSubmit}>
                      <SendIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        )
      }}
    </Formik>
  )
}

function CallButtonsMenu({ onAudioCallStart, onVideoCallStart }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef();
  return (
    <>
      <IconButton ref={buttonRef} size="small" onClick={() => setOpen(true)}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
        <MenuItem onClick={onAudioCallStart}>
          <ListItemIcon>
            <CallIcon />
          </ListItemIcon>
          <ListItemText primary="Audio call" />
        </MenuItem>
        <MenuItem onClick={onVideoCallStart}>
          <ListItemIcon>
            <VideoIcon />
          </ListItemIcon>
          <ListItemText primary="Video call" />
        </MenuItem>
      </Menu>
    </>
  )
}

function Actions({ onStartCall }) {
  const classes = useStyles();
  const handleStartAudioCall = () => onStartCall({ audio: true });
  const handleStartVideoCall = () => onStartCall({ audio: true, video: true });
  return (
    <div className={classes.actions}>
      <Hidden smDown>
        <Tooltip
          title="Audio call"
          placement="top"
          arrow
          PopperProps={{ disablePortal: true }}
        >
          <IconButton onClick={handleStartAudioCall}>
            <CallIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          title="Video call"
          placement="top"
          arrow
          PopperProps={{ disablePortal: true }}
        >
          <IconButton onClick={handleStartVideoCall}>
            <VideoIcon />
          </IconButton>
        </Tooltip>
      </Hidden>
      <Hidden mdUp>
        <CallButtonsMenu
          onAudioCallStart={handleStartAudioCall}
          onVideoCallStart={handleStartVideoCall}
        />
      </Hidden>
    </div>
  );
}

function Chat({ chat, onPostMessage, onStartCall }) {
  const classes = useStyles();

  useEffect(() => {
    const lastMessageElement = document.getElementById(`message-${chat.messages.length - 1}`);
    lastMessageElement && lastMessageElement.scrollIntoView();
  }, [chat.messages]);

  return chat.participants.length === 1 ? <EmptyChat chat={chat} /> : (
    <Grid container direction="column" alignItems="center" wrap="nowrap" className={classes.container}>
      <Grid
        container
        direction="column"
        justify="flex-end"
        alignItems="flex-start"
        className={classes.messagesContainer}
      >
        <TransitionGroup>
          {chat.messages.map((message, index) => {
            return (
              <CSSTransition key={index} classNames="mid-fade" timeout={200}>
                <Message id={`message-${index}`} key={index} {...message} className={classes.message} />
              </CSSTransition>
            )
          })}
        </TransitionGroup>
      </Grid>
      <div className={classes.bottomPanel}>
        <div className={classes.inputContainer}>
          <InputMessage onSubmit={onPostMessage} />
          <Actions onStartCall={onStartCall} />
        </div>
      </div>
    </Grid>
  );
}

export default Chat;