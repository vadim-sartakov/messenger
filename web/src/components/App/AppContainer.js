import { hot } from 'react-hot-loader/root';
import React from 'react';
import { connect } from 'react-redux';
import App from './App';
import { hideError } from '../../actions';

function AppContainer(props) {
  return <App {...props} />
}

function mapStateToProps(state) {
  return {
    error: state.app.error
  }
}

function mapDispatchToProps(dispatch) {
  return {
    hideError: () => dispatch(hideError())
  }
}

export default hot(connect(mapStateToProps, mapDispatchToProps)(AppContainer));