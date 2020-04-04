import 'react-hot-loader';
import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import App from './components/App';
import createStore from './createStore';
import './index.css';

const store = createStore();
const theme = createMuiTheme();

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);