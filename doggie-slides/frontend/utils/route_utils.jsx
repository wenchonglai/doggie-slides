import React from 'react';
import {connect} from 'react-redux'
import {Redirect, Route, withRouter} from 'react-router-dom';

const mapStateToProps = state => ({
  hasAccount: !!state.session.currentUser,
  loggedIn: typeof (state.session.currentUser) === 'number'
});

export function Auth({loggedIn, path, exact, component: Component}){
  return (
    <Route
      path={path}
      exact={exact}
      render={ props => (
        loggedIn ?
          <Redirect to="/slides/about"/> :
          <Component {...props} />
      )}
    />
  );
}

export function Protected({loggedIn, path, exact, component: Component}){
  return (
    <Route 
      path={path}
      exact={exact}
      render={ props => (
        loggedIn ?
          <Component {...props} /> :
          <Redirect to="/signin/identifier"/>
      )}
    />
  );
}

export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));