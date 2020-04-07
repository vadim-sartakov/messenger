import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
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
import { DRAWER_WIDTH } from './constants';

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex'
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        marginLeft: DRAWER_WIDTH
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
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    toolbar: {
      padding: `0 ${theme.spacing(2)}px`,
      ...theme.mixins.toolbar
    }
  };
});

function Home({ logout, data, selectedChat }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const handleDrawerClose = () => setOpenDrawer(false);
  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
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
      <Drawer
        classes={classes}
        user={data.me}
        open={openDrawer}
        onClose={handleDrawerClose}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {selectedChat !== undefined && <Chat chat={data.me.chats.find(chat => chat._id === selectedChat)} />}
      </main>
      <SessionExpiredDialog />
    </div>
  );
}

export default Home;