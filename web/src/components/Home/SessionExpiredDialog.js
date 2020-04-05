import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import { useHistory } from 'react-router-dom';
import { logout } from '../../actions';

function SessionExpiredDialog({ open = false, logout }) {
  const history = useHistory();
  const handleLogin = () => {
    logout();
    history.replace({ pathname: '/login' });
  };
  return (
    <Dialog open={open}>
      <DialogTitle>The session has expired</DialogTitle>
      <DialogContent>
        <DialogContentText>It is required to login again</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
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
  logout: () => dispatch(logout())
});

export default connect(mapStateToProps, dispatchToProps)(SessionExpiredDialog);