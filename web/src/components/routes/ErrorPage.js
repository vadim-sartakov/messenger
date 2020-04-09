import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => {
  return {
    root: {
      marginTop: theme.spacing(10)
    },
    paper: {
      padding: theme.spacing(3)
    },
    title: {
      marginBottom: theme.spacing(2)
    }
  }
});

function ErrorPage({ title, text }) {
  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.root}>
      <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.title}>{title}</Typography>
        <Typography variant="h5">{text}</Typography>
      </Paper>      
    </Container>
  )
}

export default ErrorPage;