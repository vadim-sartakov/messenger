import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import MuiDrawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import { DRAWER_WIDTH } from '../constants';
import ChatList from './ChatList';
import getShortName from '../../../utils/getShortName';

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
        flexShrink: 0
      }
    },
    drawerPaper: {
      width: DRAWER_WIDTH,
    },
    avatar: {
      marginRight: theme.spacing(2)
    }
  }
});

function ResponsiveDrawer({ open, onClose, children }) {
  const classes = useStyles();
  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <MuiDrawer
          variant="temporary"
          anchor="left"
          open={open}
          onClose={onClose}
          classes={{ paper: classes.drawerPaper }}
        >
          {children}
        </MuiDrawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <MuiDrawer
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          {children}
        </MuiDrawer>
      </Hidden>
    </nav>
  )
}

function Drawer({
  classes: rootClasses,
  user,
  open,
  onClose,
  selectedChat,
  onChatSelect,
  onCreateChat
}) {
  const classes = useStyles();
  return (
    <ResponsiveDrawer
      open={open}
      onClose={onClose}
    >
      <Grid
        container
        alignItems="center"
        wrap="nowrap"
        className={rootClasses.toolbar}
      >
        <Avatar
          className={classes.avatar}
          style={{
            color: user.colors.text,
            backgroundColor: user.colors.background
          }}
        >
          {getShortName(user.name)}
        </Avatar>
        <Typography variant="h6" noWrap>
          {user.name}
        </Typography>
      </Grid>
      <Divider />
      <ChatList
        chats={user.chats}
        selected={selectedChat}
        onSelect={onChatSelect}
        onCreateChat={onCreateChat}
      />
    </ResponsiveDrawer>
  )
}

export default Drawer;