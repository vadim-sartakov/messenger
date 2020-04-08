import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import JoinChat from './JoinChat';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default hot(App);