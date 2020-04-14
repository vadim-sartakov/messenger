import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Grow from '@material-ui/core/Grow';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './Drawer';
import SessionExpiredDialog from './SessionExpiredDialog';
import Chat from '../Chat';
import NoChats from './NoChats';

const useStyles = makeStyles(theme => {
  return {
    ...theme.palette.type !== 'dark' && {
      '@global': {
        'body': {
          backgroundColor: '#fff'
        },
      }
    },
    menuButton: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      }
    },
    title: {
      flexGrow: 1
    },
    main: {
      overflow: 'auto',
      height: '100%'
    }
  };
});

function LogoutDialog({ open, onClose, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Grow}>
      <DialogTitle>Logging out</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to logout?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
        >
          Logout
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function Home({ logout, me, chats }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const handleDrawerClose = () => setOpenDrawer(false);
  const { chatId } = useParams();
  const curChat = chats.find(chat => chat._id === chatId);

  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onResize = () => setHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <Grid container wrap="nowrap">
      <Drawer
        me={me}
        chats={chats}
        open={openDrawer}
        onClose={handleDrawerClose}
      />
      <Grid container direction="column" wrap="nowrap" style={{ height }}>
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              className={classes.menuButton}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap className={classes.title}>
              {curChat ? curChat.name : 'Messenger App'}
            </Typography>
            <Tooltip arrow title="Logout">
              <IconButton color="inherit" onClick={() => setOpenLogout(true)}>
                <ExitToApp />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <main className={classes.main}>
          {chats.length === 0 ? <NoChats /> : !chatId || !curChat ? null : <Chat id={chatId} chat={curChat} />}
        </main>
      </Grid>
      <SessionExpiredDialog />
      <LogoutDialog open={openLogout} onClose={() => setOpenLogout(false)} onSubmit={logout} />
    </Grid>
  );
}

export default Home;