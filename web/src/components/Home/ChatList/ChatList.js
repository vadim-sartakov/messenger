import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCommentIcon from '@material-ui/icons/AddComment';
import { makeStyles } from '@material-ui/core/styles';
import getShortName from '../../../utils/getShortName';

const useStyles = makeStyles({
  subheaderText: {
    flex: '1 0'
  }
});

function Chat({ name, messages, participants, colors = {} }) {
  const title = name || participants[participants.length - 1].name;
  const lastMessage = messages && messages[messages.length - 1];
  return (
    <ListItem button>
      <ListItemAvatar>
        <Avatar style={{ color: colors.text, backgroundColor: colors.background }}>
          {getShortName(title)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={title} secondary={lastMessage && lastMessage.content} />
    </ListItem>
  )
}

function ChatList({ chats = [], onCreateChat }) {
  const classes = useStyles();
  return (
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
          <IconButton
            size="small"
            className={classes.subheaderButton}
            onClick={() => onCreateChat({ name: 'Test' })}
          >
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
      {chats.map((chat, index) => <Chat key={index} {...chat} />)}
    </List>
  )
}

export default ChatList;