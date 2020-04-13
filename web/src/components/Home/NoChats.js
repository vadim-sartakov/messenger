import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonAddDisabledIcon from '@material-ui/icons/Comment';
import { makeStyles } from '@material-ui/core/styles';
import ChatDialog from './ChatDialog';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(4)
  },
  title: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  icon: {
    marginBottom: theme.spacing(4),
    fontSize: '3rem'
  }
}));

function NoChats() {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Container maxWidth="sm" disableGutters className={classes.container}>
      <Grid container direction="column" alignItems="center">
        <Typography variant="h5" className={classes.title}>
          There are no chats available
        </Typography>
        <PersonAddDisabledIcon className={classes.icon} fontSize="large" color="disabled" />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create new chat
        </Button>
      </Grid>
      <ChatDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </Container>
  )
}

export default NoChats;