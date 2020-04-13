import React, { useMemo } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { lightBlue, amber } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import IndexPage from '../routes/IndexPage';
import Alert from '../ui/Alert';

function App({ darkMode, message = {}, hideError }) {
  const theme = useMemo(() => {
    return createMuiTheme({
      palette: {
        primary: {
          main: lightBlue[700]
        },
        secondary: {
          main: amber[500]
        },
        type: darkMode && 'dark'
      }
    })
  }, [darkMode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IndexPage />
      <Snackbar
        open={Boolean(message.open)}
        onClose={hideError}
        autoHideDuration={message.autoHide && 5000}
      >
        <Alert severity={message.severity} onClose={hideError}>{message.text}</Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;