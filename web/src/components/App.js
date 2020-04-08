import { hot } from 'react-hot-loader/root';
import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightBlue, amber } from '@material-ui/core/colors';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Login from './Login';
import Home from './Home';
import JoinChat from './JoinChat';
import ProtectedRoute from './ProtectedRoute';

function App({ darkMode }) {
  const theme = useMemo(() => {
    return createMuiTheme({
      palette: {
        primary: {
          main: lightBlue[700]
        },
        secondary: {
          main: amber[500]
        },
        type: darkMode && 'dark',
        ...!darkMode && {
          background: {
            default: '#fff'
          }
        }
      }
    })
  }, [darkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoute exact path="/">
          <Home />
        </ProtectedRoute>
        <ProtectedRoute path="/:id">
          <JoinChat />
        </ProtectedRoute>
      </Switch>
    </ThemeProvider>
  );
}

export default hot(App);