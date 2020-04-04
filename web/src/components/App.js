import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <ProtectedRoute exact path="/" redirectTo="/login">
          <Home />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default hot(App);