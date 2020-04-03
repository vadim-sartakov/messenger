import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form, useField } from 'formik';

const useStyles = makeStyles(theme => {
  return {
    root: {
      marginTop: theme.spacing(10)
    },
    paper: {
      padding: theme.spacing(3)
    },
    title: {
      marginBottom: theme.spacing(5)
    },
    input: {
      marginBottom: theme.spacing(5)
    },
    submit: {
      marginBottom: theme.spacing(2)
    }
  };
});

function validate(values) {
  const errors = {};
  if (!values.username || !values.username.length) errors.username = 'Username is required';
  return errors;
}

const initialValues = {
  username: ''
};

function InputField(props) {
  const [field, meta] = useField(props);
  return (
    <TextField
      {...props}
      {...field}
      error={Boolean(meta.touched && meta.error)}
      helperText={meta.error}
    />
  );
}

function Login({ onSubmit }) {
  const classes = useStyles();
  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      <Form noValidate>
        <Container maxWidth="xs" className={classes.root}>
          <Grid
            container
            component={Paper}
            direction="column"
            alignItems="center"
            className={classes.paper}
          >
            <Typography variant="h5" className={classes.title}>
              Messenger App
            </Typography>
            <InputField
              className={classes.input}
              id="username"
              name="username"
              required
              fullWidth
              label="Username"
              variant="outlined"
              placeholder="Enter your username"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />
            <Button
              className={classes.submit}
              type="submit"
              color="primary"
              variant="contained"
              fullWidth
            >
              Create chat room
            </Button>
          </Grid>
        </Container>
      </Form>
    </Formik>
  );
}

export default Login;