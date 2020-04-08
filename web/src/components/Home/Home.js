import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from './Drawer';
import SessionExpiredDialog from './SessionExpiredDialog';
import Chat from '../Chat';
import NoChats from './NoChats';

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex'
    },
    menuButton: {
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      }
    },
    title: {
      flexGrow: 1
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    }
  };
});

function Home({ location, logout, me, chats, selectedChat, onSelectChat, onCreateChat }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const handleDrawerClose = () => setOpenDrawer(false);
  const currentChat = chats.find(chat => chat._id === selectedChat);
  return (
    <Grid container wrap="nowrap">
      <Drawer
        me={me}
        chats={chats}
        open={openDrawer}
        onClose={handleDrawerClose}
        selectedChat={selectedChat}
        onSelectChat={onSelectChat}
        onCreateChat={onCreateChat}
      />
      <Grid container direction="column" wrap="nowrap">
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
              Messenger App
            </Typography>
            <Tooltip arrow title="Logout">
              <IconButton color="inherit" onClick={logout}>
                <ExitToApp />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        
        <main className={classes.content}>
          {chats.length === 0 ? <NoChats /> : !currentChat ? null : <Chat chat={currentChat} location={location} />}
        </main>
      </Grid>
      <SessionExpiredDialog />
    </Grid>
  );
}

export default Home;