import React from 'react';
import {Link, Redirect, Route, Switch, withRouter} from 'react-router-dom';

import {ProtectedRoute, AuthRoute} from '../utils/route_utils';
import SigninEmailPageContainer from './session/signin_email_page_container';
import SigninPasswordPageContainer from './session/signin_password_page_container';
import SplashPage from './splash/splash_page'

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

function SignupPage(props){
  return (
    <div>Sign Up</div>
  )
}

export default function App(props){
  return (
    <Switch>
      <Route path='/:productName/about' exact component={SplashPage}/>
      <AuthRoute path='/signin/identifier' exact component={SigninEmailPageContainer}/>
      <AuthRoute path='/signin/challenge' exact component={SigninPasswordPageContainer}/>
      <AuthRoute path='/signup' exact component={SignupPage}/>
      <ProtectedRoute path='/presentation' component={PresentationPage}/>
      <Route path='/' render={() => <Redirect to="/slides/about"/>}/>
    </Switch>
  )
};