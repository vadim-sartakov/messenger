import React, { useState, useRef, forwardRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddCommentIcon from '@material-ui/icons/AddComment';
import SettingsIcon from '@material-ui/icons/Settings';
import EditIcon from '@material-ui/icons/Edit';
import LinkIcon from '@material-ui/icons/Link';
import PersonIcon from '@material-ui/icons/Person';
import { makeStyles } from '@material-ui/core/styles';
import ColoredAvatar from '../../ui/ColoredAvatar';
import CreateNewChat from '../ChatDialog';
import getShortName from '../../../utils/getShortName';
import InviteLink from '../../ui/InviteLink';
import ChatDialog from '../ChatDialog';

const useStyles = makeStyles(theme => {
  return {
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
    avatar: {
      marginRight: theme.spacing(2),
      backgroundColor: props => props.color,
      color: props => props.color && theme.palette.getContrastText(props.color)
    },
    actions: {
      '&:hover': {
        opacity: 1
      },
      opacity: 0,
      transition: 'opacity 200ms ease-in-out'
    }
  }
});

const EditOption = forwardRef(function LinkOption({ chat }, ref) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MenuItem ref={ref} onClick={() => setOpen(true)}>
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Rename" />
      </MenuItem>
      <ChatDialog open={open} onClose={() => setOpen(false)} chat={chat} />
    </>
  )
});

const LinkOption = forwardRef(function LinkOption({ chat }, ref) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <MenuItem ref={ref} onClick={() => setOpen(true)}>
        <ListItemIcon>
          <LinkIcon />
        </ListItemIcon>
        <ListItemText primary="View Link" />
      </MenuItem>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Share this link with others for invite:</DialogContentText>
          <InviteLink chat={chat} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
});

function Chat({ me, chat, selected, onClick }) {
  const { name, messages, participants, color } = chat;
  const classes = useStyles();
  const title = name || participants[participants.length - 1].name;
  const lastMessage = messages && messages[messages.length - 1];
  const settingsButtonRef = useRef();
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <>
      <ListItem button selected={selected} onClick={onClick} className={classes.chat}>
        <ListItemAvatar>
          <ColoredAvatar className={classes.avatar} color={color}>
            {getShortName(title)}
          </ColoredAvatar>
        </ListItemAvatar>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ noWrap: true }}
          secondary={lastMessage && lastMessage.content}
          secondaryTypographyProps={{ noWrap: true }}
        />
        <ListItemSecondaryAction className={classes.actions}>
          <Tooltip title="Settings" arrow placement="right">
            <IconButton size="small" onClick={() => setOpenMenu(true)}>
              <SettingsIcon ref={settingsButtonRef} fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>
      </ListItem>
      <Menu
        anchorEl={settingsButtonRef.current}
        open={openMenu}
        onClose={() => setOpenMenu(false)}
        onClick={() => setOpenMenu(false)}
        keepMounted
      >
        {me._id === chat.owner && <EditOption chat={chat} />}
        <LinkOption chat={chat} />
        <MenuItem>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Participants" />
        </MenuItem>
      </Menu>
    </>
  )
}

function ChatList({ me, chats = [], onCreateChat }) {
  const classes = useStyles();
  const history = useHistory();
  const { chatId: selected } = useParams();
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
            me={me}
            chat={chat}
            selected={selected === chat._id}
            onClick={() => history.replace({ pathname: `/chats/${chat._id}` })}
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