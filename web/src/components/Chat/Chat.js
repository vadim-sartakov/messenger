import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import { makeStyles } from '@material-ui/core/styles';
import SendIcon from '@material-ui/icons/Send';
import { Formik, Form } from 'formik';
import InputTextField from '../ui/InputTextField';
import EmptyChat from './EmptyChat';
import { isRequired } from '../../utils/validators';

const useStyles = makeStyles(theme => {
  return {
    paper: {
      height: '100%',
      padding: theme.spacing(3),
      paddingTop: 0,
      overflow: 'auto'
    },
    innerContainer: {
      height: '100%'
    },
    messagesContainer: {
      flexGrow: 1
    },
    inputContainer: {
      width: '100%',
      position: 'sticky',
      bottom: 0,
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
  const handleSubmit = (value, { resetForm }) => {
    onSubmit(value);
    resetForm();
  };
  return (
    <Formik
      initialValues={inputInitialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      <Form>
        <InputTextField
            ignoreError
            id="content"
            name="content"
            placeholder="Type a message"
            variant="outlined"
            multiline
            fullWidth
            InputProps={{
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
    </Formik>
  )
}

function Chat({ chat, location, postMessage }) {
  const classes = useStyles();
  return chat.participants.length === 0 ? <EmptyChat chat={chat} location={location} /> : (
    <Paper className={classes.paper}>
      <Grid container direction="column" alignItems="center" className={classes.innerContainer}>
        <Grid
          container
          direction="column"
          justify="flex-end"
          alignItems="center"
          className={classes.messagesContainer}
        >
          {chat.messages.map((message, index) => {
            return <div key={index}>{message.content}</div>
          })}
        </Grid>
        <div className={classes.inputContainer}>
          <InputMessage onSubmit={postMessage} />
        </div>
      </Grid>
    </Paper>
  );
}

export default Chat;