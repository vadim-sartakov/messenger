import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Settings from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import CreateNewChat from '../CreateNewChat';
import getShortName from '../../../utils/getShortName';

const useStyles = makeStyles({
  subheaderText: {
    flex: '1 0'
  },
  chat: {
    // For some reason root list class does not contain actions
    // All children list elements placed to wrapper except actions
    // So to target actions using sibling selector (+)
    '&:hover + $actions': {
      opacity: 1,
      transition: 'opacity 200ms ease-in-out'
    }
  },
  actions: {
    '&:hover': {
      opacity: 1
    },
    opacity: 0,
    transition: 'opacity 200ms ease-in-out'
  }
});

function Chat({ name, messages, participants, colors = {}, selected, onClick }) {
  const classes = useStyles();
  const title = name || participants[participants.length - 1].name;
  const lastMessage = messages && messages[messages.length - 1];
  return (
    <ListItem button selected={selected} onClick={onClick} className={classes.chat}>
      <ListItemAvatar>
        <Avatar style={{ color: colors.text, backgroundColor: colors.background }}>
          {getShortName(title)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        primaryTypographyProps={{ noWrap: true }}
        secondary={lastMessage && lastMessage.content}
      />
      <ListItemSecondaryAction className={classes.actions}>
        <Tooltip title="Settings" arrow placement="right">
          <IconButton size="small">
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

function ChatList({ chats = [], onCreateChat, selected, onSelect }) {
  const classes = useStyles();
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleCreate = async newChat => {
    await onCreateChat(newChat);
    handleCloseDialog();
  };

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
        <Tooltip title="Create chat" arrow placement="right">
          <IconButton
            size="small"
            className={classes.subheaderButton}
            onClick={handleOpenDialog}
          >
            <AddCommentIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Grid>
      {chats.map(chat => {
        return (
          <Chat
            key={chat._id}
            {...chat}
            selected={selected === chat._id}
            onClick={() => onSelect(chat._id)}
          />
        )
      })}
      <CreateNewChat
        open={openDialog}
        onClose={handleCloseDialog}
        onCreate={handleCreate}
      />
    </List>
  )
}

export default ChatList;