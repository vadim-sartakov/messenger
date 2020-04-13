import React, { useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { Formik, Form } from 'formik';
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
    inputMessageContainer: {
      position: 'sticky',
      bottom: 0,
      zIndex: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: `${theme.spacing(1)}px ${theme.spacing(3)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
      '& form': {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }
    },
    inputMessage: {
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: theme.breakpoints.values.sm
      }
    }
  };
});

const inputInitialValues = { content: '' };

function validate({ content }) {
  return !isRequired(content) ? { content: 'Type a message' } : {};
}

function InputMessage({ onSubmit }) {
  const classes = useStyles();
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
          <Form>
            <InputTextField
              ignoreError
              className={classes.inputMessage}
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
                    <Tooltip title="Send" placement="top" arrow>
                      <IconButton color="primary" type="submit">
                        <SendIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Form>
        )
      }}
      
    </Formik>
  )
}

// TODO:
// Add messages transition group
// Add messages pagination
function Chat({ chat, location, postMessage }) {
  const classes = useStyles();

  useEffect(() => {
    const lastMessageElement = document.getElementById(`message-${chat.messages.length - 1}`);
    lastMessageElement && lastMessageElement.scrollIntoView();
  }, [chat.messages]);

  return chat.participants.length === 1 ? <EmptyChat chat={chat} location={location} /> : (
    <Grid container direction="column" alignItems="center" wrap="nowrap" className={classes.container}>
      <Grid
        container
        direction="column"
        justify="flex-end"
        alignItems="flex-start"
        className={classes.messagesContainer}
      >
        {chat.messages.map((message, index) => {
          return (
            <Message id={`message-${index}`} key={index} {...message} className={classes.message} />
          )
        })}
      </Grid>
      <div className={classes.inputMessageContainer}>
        <InputMessage onSubmit={postMessage} />
      </div>
    </Grid>
  );
}

export default Chat;