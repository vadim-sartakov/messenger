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
import { createChat } from '../../actions';
import { CREATE_CHAT } from '../../queries';
import graphqlFetch from '../../utils/graphqlFetch';
import { isRequired } from '../../utils/validators';
import { GRAPHQL_URL } from '../../constants';

const defaultInitialValues = {
  name: ''
};

function validate(value) {
  const errors = {};
  if (!isRequired(value.name)) errors.name = 'Name is required';
  return errors;
}

function ChatDialog({ open, onClose, initialValues = defaultInitialValues, onSubmit }) {
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose} TransitionComponent={Grow}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        <Form noValidate>
          <DialogTitle>Create New Chat</DialogTitle>
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
              Create
            </Button>
          </DialogActions>
        </Form>
      </Formik>
    </Dialog>
  )
}

function ChatDialogContainer({ id, createChat, onClose, ...props }) {
  const history = useHistory();
  const handleSubmit = useCallback(async chat => {
    if (!id) createChat(chat, history);
    onClose();
  }, [id, history, createChat, onClose]);
  return <ChatDialog {...props} onClose={onClose} onSubmit={handleSubmit} />;
}

function mapDispatchToProps(dispatch) {
  return {
    createChat: (chat, history) => dispatch(createChat(chat, history))
  }
}

export default connect(undefined, mapDispatchToProps)(ChatDialogContainer);