import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ExitToApp from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
import MenuIcon from '@material-ui/icons/Menu';
import SessionExpiredDialog from './SessionExpiredDialog';

const drawerWidth = 240;

const useStyles = makeStyles(theme => {
  return {
    root: {
      display: 'flex'
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
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
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: drawerWidth,
    },
    avatar: {
      marginRight: theme.spacing(2)
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

function ResponsiveDrawer({ open, onClose, children }) {
  const classes = useStyles();
  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={onClose}
          classes={{ paper: classes.drawerPaper }}
        >
          {children}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          {children}
        </Drawer>
      </Hidden>
    </nav>
  )
}

function getShortName(name) {
  const parts = name.split(' ');
  const string = parts.length === 2 ?
    parts[0].charAt(0) + parts[1].charAt(0) :
    name.substring(0, 2);
  return string.toUpperCase();
}

function Home({ user, logout, chats }) {
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
          <IconButton color="inherit" title="Logout" onClick={logout}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <ResponsiveDrawer
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        <Grid
          container
          alignItems="center"
          wrap="nowrap"
          className={classes.toolbar}
        >
          <Avatar
            className={classes.avatar}
            style={{
              color: user.textColor,
              backgroundColor: user.color
            }}
          >
            {getShortName(user.username)}
          </Avatar>
          <Typography variant="h6" noWrap>
            {user.username}
          </Typography>
        </Grid>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map(text => (
            <ListItem button key={text}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </ResponsiveDrawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
          facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
          gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
          donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
          adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
          Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
          imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
          arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
          donec massa sapien faucibus et molestie ac.
        </Typography>
      </main>
      <SessionExpiredDialog />
    </div>
  );
}

export default Home;