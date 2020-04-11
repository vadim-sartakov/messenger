import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Grow from '@material-ui/core/Grow';
import { useHistory } from 'react-router-dom';
import { logOut } from '../../actions';

function SessionExpiredDialog({ open = false, logOut }) {
  const history = useHistory();
  const handleLogout = () => logOut(history);
  return (
    <Dialog open={open} TransitionComponent={Grow}>
      <DialogTitle>The session has expired</DialogTitle>
      <DialogContent>
        <DialogContentText>It is required to login again</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = state => ({
  open: state.auth.tokenExpired
});

const dispatchToProps = dispatch => ({
  logOut: history => dispatch(logOut(history))
});

export default connect(mapStateToProps, dispatchToProps)(SessionExpiredDialog);