import React from 'react';
import { Switch, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../Login';
import Home from '../Home';
import JoinChat from '../JoinChat';
import ErrorPage from './ErrorPage';

function NotFound() {
  return <ErrorPage title="Looks like you have lost..." text="Page not found" />;
}

function IndexPage() {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <ProtectedRoute path="/">
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/chats/:chatId">
            <Home />
          </Route>
          <Route path="/invite/:id">
            <JoinChat />
          </Route>
          <NotFound />
        </Switch>
      </ProtectedRoute>
      <NotFound />
    </Switch>
  )
}

export default IndexPage;