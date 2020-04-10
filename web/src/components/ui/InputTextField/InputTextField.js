import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useField } from 'formik';

function InputTextField({ ignoreError, ...props }) {
  const [field, meta] = useField(props);
  return (
    <TextField
      {...props}
      {...field}
      error={!ignoreError && Boolean(meta.touched && meta.error)}
      helperText={!ignoreError && meta.touched && meta.error}
    />
  );
}

export default InputTextField;