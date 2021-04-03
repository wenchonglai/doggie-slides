import React from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';

import {ProtectedRoute, AuthRoute} from '../utils/route_utils';
import SigninEmailPageContainer from './auth/signin_email_page_container';
import SigninPasswordPage from './auth/signin_password_page';
import SplashPage from './splash/splash_page'

function ErrorPage(props){
  return (
    <div>
      Error; Page not found
    </div>
  )
}


function PresentationPageContainer(props){
  return (<div>edit</div>);
}

export default function App(props){
  return (
    <Switch>
      <Route path='/slides/about' exact component={SplashPage}/>
      <AuthRoute path='/signin/identifier' exact component={SigninEmailPageContainer}/>
      <AuthRoute path='/signin/challenge' exact component={SigninPasswordPage}/>
      <ProtectedRoute path='/presentation' component={PresentationPageContainer}/>
      <Route path='/' exact render={() => <Redirect to="/slides/about"/>}/>
    </Switch>
  )
};