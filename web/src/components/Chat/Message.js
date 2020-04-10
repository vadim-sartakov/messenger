import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ColoredAvarar from '../ui/ColoredAvatar';
import getShortName from '../../utils/getShortName';

const useStyles = makeStyles(theme => {
  return {
    avatar: {
      marginRight: theme.spacing(1)
    },
    notSent: {
      opacity: 0.5
    },
    content: {
      whiteSpace: 'pre'
    }
  }
});

function Message({ author, content, createdAt, notSent }) {
  const classes = useStyles();
  return (
    <Grid container alignItems="flex-start" wrap="nowrap">
      <ColoredAvarar
        color={author.color}
        className={classNames(classes.avatar, { [classes.notSent]: notSent })}
      >
        {getShortName(author.name)}
      </ColoredAvarar>
      <Grid container direction="column">
        <Typography variant="caption">
          <span>
            {author.name}
          </span>
          <span>, </span>
          <span>
            {moment(createdAt).format('MMMM D [at] hh:mm')}
          </span>
        </Typography>
        <Typography className={classes.content}>{content}</Typography>
      </Grid>
    </Grid>
  )
}

export default Message;