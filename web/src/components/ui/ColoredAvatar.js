import React from 'react';
import classNames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      backgroundColor: props => props.color,
      color: props => props.color && theme.palette.getContrastText(props.color)
    }
  }
});

// eslint-disable-next-line no-unused-vars
function ColoredAvatar({ className, color, ...props }) {
  const classes = useStyles({ color });
  return <Avatar {...props} className={classNames(className, classes.avatar)} />
}

export default ColoredAvatar;