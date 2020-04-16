import React from 'react';
import Hidden from '@material-ui/core/Hidden';
import MuiDrawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import ChatList from './ChatList';
import ColoredAvatar from '../../ui/ColoredAvatar';
import getShortName from '../../../utils/getShortName';

const DRAWER_WIDTH = 240;

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: DRAWER_WIDTH,
        flexShrink: 0
      }
    },
    user: {
      padding: `0 ${theme.spacing(2)}px`,
      ...theme.mixins.toolbar
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
  isLoading,
  me,
  chats,
  open,
  onClose,
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
        className={classes.user}
      >
        {isLoading ? (
          <Skeleton
            className={classes.avatar}
            variant="circle"
            animation="wave"
            width={40}
            height={40}
          />
        ) : (
          <ColoredAvatar className={classes.avatar} color={me.color}>
            {getShortName(me.name)}
          </ColoredAvatar>
        )}
        {isLoading ? (
          <Skeleton
            variant="text"
            animation="wave"
            width={120}
            height={32}
          />
        ) : (
          <Typography variant="h6" noWrap>
            {me.name}
          </Typography>
        )}
      </Grid>
      <Divider />
      <ChatList
        isLoading={isLoading}
        me={me}
        chats={chats}
        onCreateChat={onCreateChat}
      />
    </ResponsiveDrawer>
  )
}

export default Drawer;