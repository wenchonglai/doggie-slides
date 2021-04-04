import React from 'react';
import {Link} from 'react-router-dom';
import SigninWrapper from './signin_wrapper';

import SmartInputContainer from './smart_input';

export default function SigninPasswordPage({history, loginHandler, errors}){
  const localStorageObject = JSON.parse(localStorage.getItem("doggieSlides")) || {user: {}};
  const [user, setUser] = React.useState(
    {...localStorageObject.user, password: ""}
  );

  function handleSubmit(e, user){
    // props.history.push('/signin/challenge')
    e.preventDefault();
    loginHandler(user).then(res => {
      history.push('/presentation');
    });
  }

  function handleChange(e){
    setUser({...user, password: e.target.value});
  }

  return (
    <SigninWrapper>
        <h1>{`Hi, ${user.firstname}`}</h1>
        <div className='heading-subtext'>{user.email}</div>
        <form onSubmit={(e) => handleSubmit(e, user)}>
          <SmartInputContainer
            type="password"
            name="user[password]"
            labelText="Enter your password"
            value={user.password}
            onChange={(e) => handleChange(e)}
            errors={errors}
          >
            {/* <div className="body-subtext">
              Forgot your password? Use Demo user to sign in privately.
              <Link className='link' to='#'>Demo User</Link>
            </div> */}
          </SmartInputContainer>


          <div className="bottom-bar">
            <Link className='link' to='/signup/identifier'>Forgot password</Link>
            <input type='submit' value='Next'/>
          </div>
        </form>
    </SigninWrapper>
  );
}