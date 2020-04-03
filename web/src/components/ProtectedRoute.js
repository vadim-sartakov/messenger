import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ user, children, ...props }) {
  return (
    <Route
      render={({ location }) => {
        return user ? children : (
          <Redirect
            to={{
              pathname: '/login',
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
  return { user: state.app.user };
}


const ProtectedRouteContainer = connect(mapStateToProps)(ProtectedRoute);

export default ProtectedRouteContainer;