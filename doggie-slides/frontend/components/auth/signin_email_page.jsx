import React from 'react';
import {Link} from 'react-router-dom';
import SigninWrapper from './signin_wrapper';

import SmartInput from './smart_input';

export default function SigninEmailPage({history, fetchAccountHandler}){
  function handleSubmit(e){
    // props.history.push('/signin/challenge')
    e.preventDefault();

    fetchAccountHandler(user).then(({user}) => {
      const localStorageObject = JSON.parse(localStorage.getItem('doggieSlides')) || {};

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

  function handleChange(e){
    setUser({...user, email: e.target.value});
  }

  const [user, setUser] = React.useState({email: ""});

  return (
    <SigninWrapper>
        <h1>Sign in</h1>
        <div className='heading-subtext'>to continue to Doogie Slides</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <SmartInput
            type="email"
            name="user[email]"
            labelText="Email or Phone"
            value={user.email}
            onChange={(e) => handleChange(e)}
          >
            {/* Forgot Email? -> Fake an email */}

            <div className="body-subtext">
              Not your computer? Use Demo user to sign in privately.
              <Link className='link' to='#'>Demo User</Link>
            </div>
          </SmartInput>


          <div className="bottom-bar">
            <Link className='link' to='/signup/identifier'>Create account</Link>
            <input type='submit' value='Next'/>
          </div>
        </form>
    </SigninWrapper>
  );
}