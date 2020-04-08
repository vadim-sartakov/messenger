import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import { Formik, Form } from 'formik';
import InputTextField from '../InputTextField';
import { isRequired } from '../../utils/validators';

const initialValues = {
  name: ''
};

function validate(value) {
  const errors = {};
  if (!isRequired(value.name)) errors.name = 'Name is required';
  return errors;
}

function CreateNewChat({ open, onClose, onCreate }) {
  const handleSubmit = async newChat => {
    await onCreate(newChat);
    onClose();
  };
  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose} TransitionComponent={Grow}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
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

export default CreateNewChat;