import { hot } from 'react-hot-loader/root';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import Home from './Home';

function App({ user }) {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route
          exact
          path="/"
          render={({ location }) => {
            return user ? <Home /> : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: location }
                }}
              />
            )
          }}
        />
      </Switch>
    </BrowserRouter>
  );
}

function mapStateToProps(state) {
  return { user: state.app.user };
}

const AppContainer = connect(mapStateToProps)(App);

export default hot(AppContainer);