import React from 'react';
import {Link} from 'react-router-dom';

import SessionWrapper from './session_wrapper';
import SmartInputContainer from './smart_input';

export default function SigninEmailPage({history, demoLoginHandler, fetchAccountHandler, errors}){
  const localStorageObject = JSON.parse(localStorage.getItem("doggieSlides")) || {user: {}};
  const [user, setUser] = React.useState({...localStorageObject.user});

  function handleSubmit(e){
    // props.history.push('/signin/challenge')
    e.preventDefault();

    fetchAccountHandler(user).then(({user}) => {
      localStorage.setItem(
        'doggieSlides',
        JSON.stringify({
          ...localStorageObject,
          user: Object.assign({}, user)
        })
      );

      history.push('/signin/challenge');
    })
  }

  function handleDemoLogin(e){
    e.preventDefault();
    const demoUser = {email: "demo@dmail.com", password: "123456"};

    demoLoginHandler(demoUser).then(() => {
      history.replace('/presentation');
    });
  }

  function handleChange(e){
    setUser({...user, email: e.target.value});
  }

  return (
    <SessionWrapper>
        <h1>Sign in</h1>
        <div className='heading-subtext'>to continue to Doogie Slides</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <SmartInputContainer
            type="email"
            name="user[email]"
            labelText="Email or Phone"
            value={user.email}
            onChange={(e) => handleChange(e)}
            errors={errors}
          >
            {/* Forgot Email? -> Fake an email */}

            <div className="body-subtext">
              Not your computer? Use Demo user to sign in privately.
              <Link className='link' to='#' onClick={(e) => handleDemoLogin(e)}>Demo User</Link>
            </div>
          </SmartInputContainer>


          <div className="bottom-bar">
            <Link className='link' to='/signup'>Create account</Link>
            <input type='submit' value='Next'/>
          </div>
        </form>
    </SessionWrapper>
  );
}