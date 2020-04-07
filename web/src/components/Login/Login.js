import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import { isRequired } from '../../utils/validators';
import InputTextField from '../InputTextField';

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
      marginBottom: theme.spacing(3)
    },
    submit: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    }
  };
});

function validate(values) {
  const errors = {};
  if (!isRequired(values.name)) errors.name = 'Name is required';
  return errors;
}

const initialValues = {
  name: '',
};

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
            <InputTextField
              className={classes.input}
              id="name"
              name="name"
              required
              fullWidth
              label="Name"
              variant="outlined"
              placeholder="Enter your name"
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
              Login
            </Button>
          </Grid>
        </Container>
      </Form>
    </Formik>
  );
}

export default Login;