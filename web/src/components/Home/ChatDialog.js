import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import { Formik, Form } from 'formik';
import InputTextField from '../ui/InputTextField';
import { createChat, renameChat } from '../../actions';
import { isRequired } from '../../utils/validators';

const newChat = {
  name: ''
};

function validate(value) {
  const errors = {};
  if (!isRequired(value.name)) errors.name = 'Name is required';
  return errors;
}

function ChatDialog({ open, onClose, chat, onSubmit }) {
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose} TransitionComponent={Grow}>
      <Formik
        initialValues={chat}
        validate={validate}
        onSubmit={onSubmit}
      >
        <Form noValidate>
          <DialogTitle>{chat._id ? 'Update Chat' : 'Create New Chat'}</DialogTitle>
          <DialogContent>
            <InputTextField
              id="name"
              name="name"
              label="Name"
              placeholder="Enter chat name"
              variant="outlined"
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {chat._id ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  )
}

function ChatDialogContainer({ chat = newChat, createChat, renameChat, onClose, ...props }) {
  const history = useHistory();
  const handleSubmit = useCallback(async ({ name }) => {
    if (chat._id) renameChat(chat._id, name);
    else createChat({ name }, history);
    onClose();
  }, [chat, history, createChat, renameChat, onClose]);
  return <ChatDialog {...props} chat={chat} onClose={onClose} onSubmit={handleSubmit} />;
}

function mapDispatchToProps(dispatch) {
  return {
    createChat: (chat, history) => dispatch(createChat(chat, history)),
    renameChat: (id, name) => dispatch(renameChat(id, name))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatDialogContainer);