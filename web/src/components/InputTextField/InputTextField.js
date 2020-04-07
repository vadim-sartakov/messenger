import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';

function InputTextField(props) {
  const [field, meta] = useField(props);
  return (
    <TextField
      {...props}
      {...field}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
}

export default InputTextField;