import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import ProtectedRoute from './ProtectedRoute';
import Login from '../Login';
import Home from '../Home';
import ErrorPage from './ErrorPage';
import './styles.css';

function NotFound() {
  return <ErrorPage title="Looks like you have lost..." text="Page not found" />;
}

function IndexPage() {
  const location = useLocation();
  return (
    <SwitchTransition>
      <CSSTransition
        // To prevent transitions between home pages
        // assigning the same key for all non login pages
        key={location.pathname === '/login' ? location.key : 'home'}
        classNames="fade"
        timeout={400}
      >
        <Switch location={location}>
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
              <Route path="/:inviteLink">
                <Home />
              </Route>
              <NotFound />
            </Switch>
          </ProtectedRoute>
          <NotFound />
        </Switch>
      </CSSTransition>
    </SwitchTransition>
  )
}

export default IndexPage;