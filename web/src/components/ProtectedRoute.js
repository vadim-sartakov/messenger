import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ user, redirectTo, children, ...props }) {
  return (
    <Route
      render={({ location }) => {
        return user ? children : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: location }
            }}
          />
        )
      }}
      {...props}
    />
  );
}

function mapStateToProps(state) {
  return { user: state.auth.user };
}

const ProtectedRouteContainer = connect(mapStateToProps)(ProtectedRoute);

export default ProtectedRouteContainer;