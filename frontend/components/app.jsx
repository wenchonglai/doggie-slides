import React, { useEffect, useRef } from 'react';
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom';

import {ProtectedRoute, AuthRoute} from '../utils/route_utils';
import SigninEmailPageContainer from './session/signin_email_page_container';
import SigninPasswordPageContainer from './session/signin_password_page_container';
import SignupContainer from './session/signup_page_container';
import UserInfoContainer from './session/user_info_container';
import SplashPage from './splash/splash_page'
import {clearErrors} from '../actions/session_actions'
import { connect } from 'react-redux';

function PresentationPage(props){
  return (
    <div>
      <header>
        <UserInfoContainer />
      </header>
      <p>
        edit
      </p>
      <button>Log out!</button>
    </div>
  );
}

function App({history, clearErrorsHandler}){
  const unListenRef = useRef();

  useEffect(() => {
    unListenRef.current = history.listen((l, a) => {
      clearErrorsHandler();
    });
  
    return () => {
      unListenRef.current.unlisten();
    }
  }, []);

  return (
    <Switch>
      <Route path='/:productName/about' exact component={SplashPage}/>
      <AuthRoute path='/signin/identifier' exact component={SigninEmailPageContainer}/>
      <AuthRoute path='/signin/challenge' exact component={SigninPasswordPageContainer}/>
      <AuthRoute path='/signup' exact component={SignupContainer}/>
      <ProtectedRoute path='/presentation' component={PresentationPage}/>
      <Route path='/signin' render={() => <Redirect to="/signin/identifier"/>}/>
      <Route path='/' render={() => <Redirect to="/slides/about"/>}/>
    </Switch>
  )
};

const mapDTP = dispatch => ({
  clearErrorsHandler: () => dispatch(clearErrors())
});

export default withRouter(connect(null, mapDTP)(App));