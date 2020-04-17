import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InviteLink from '../ui/InviteLink';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  subtitle: {
    marginBottom: theme.spacing(1)
  }
}));

function EmptyChat({ chat }) {
  const classes = useStyles();
  
  return (
    <Container maxWidth="sm" disableGutters className={classes.container}>
      <Grid container direction="column">
        <Typography variant="h5" className={classes.title}>
          No one has been invited yet...
        </Typography>
        <Typography variant="subtitle1" className={classes.subtitle}>
          Share this link with others for invite:
        </Typography>
        <InviteLink chat={chat} />
      </Grid>
    </Container>
  )
}

export default EmptyChat;