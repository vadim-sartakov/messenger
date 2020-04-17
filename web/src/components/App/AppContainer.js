import { hot } from 'react-hot-loader/root';
import React from 'react';
import { connect } from 'react-redux';
import App from './App';
import { hideMessage } from '../../actions';

function AppContainer(props) {
  return <App {...props} />
}

function mapStateToProps(state) {
  return {
    darkMode: state.app.darkMode,
    message: state.app.message
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideError: () => dispatch(hideMessage())
  }
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(AppContainer));