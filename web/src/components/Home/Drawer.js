import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import MuiDrawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InboxIcon from '@material-ui/icons/Inbox';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { makeStyles } from '@material-ui/core/styles';
import { DRAWER_WIDTH } from './constants';

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
    },
    subheaderText: {
      flex: '1 0'
    }
  }
});

function getShortName(name) {
  const parts = name.split(' ');
  const string = parts.length === 2 ?
    parts[0].charAt(0) + parts[1].charAt(0) :
    name.substring(0, 2);
  return string.toUpperCase();
}

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

function Chat({ name, messages, participants }) {
  const title = name || participants[participants.length - 1].name;
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar>
          {getShortName(title)}
        </Avatar>
      </ListItemAvatar>
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={title} secondary={messages[messages.length - 1].content} />
    </ListItem>
  )
}

function Drawer({ classes: rootClasses, user, open, onClose, me }) {
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
      <List>
        <Grid
          component={ListSubheader}
          container
          alignItems="center"
        >
          <div className={classes.subheaderText}>
            Chat rooms
          </div>
          <Tooltip title="Create chat" arrow>
            <IconButton size="small" className={classes.subheaderButton}>
              <AddCommentIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
        {me.chats.map(chat => <Chat key={chat._id} {...chat} />)}
      </List>
    </ResponsiveDrawer>
  )
}

export default Drawer;