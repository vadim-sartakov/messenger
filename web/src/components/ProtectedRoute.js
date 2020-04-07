import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ token, redirectTo, children, ...props }) {
  return (
    <Route
      render={({ location }) => {
        return token ? children : (
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
  return { token: state.auth.token };
}

const ProtectedRouteContainer = connect(mapStateToProps)(ProtectedRoute);

export default ProtectedRouteContainer;