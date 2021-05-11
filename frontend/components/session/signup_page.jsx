import React from 'react';
import {Link} from 'react-router-dom';
import SigninWrapper from './session_wrapper';

import SmartInputContainer from './smart_input';

export default function SignupPage({history, signupHandler, errors}){
  const localStorageObject = JSON.parse(localStorage.getItem("doggieSlides")) || {user: {}};
  const [user, setUser] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  });
  
  const handleChange = (e, key) => {
    setUser({...user, [key]: e.target.value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    signupHandler(user).then(res => {
      localStorage.setItem(
        'doggieSlides',
        JSON.stringify({
          ...localStorageObject,
          user: Object.assign({}, user)
        })
      );
      
      history.push('/presentation');
    })
  }

  return (
    <SigninWrapper className='signup'>
        <h1>Create your DoggIe Account</h1>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='name'>
            <SmartInputContainer
              type="text"
              name="user[firstname]"
              labelText="First name"
              value={user.firstname}
              onChange={(e) => handleChange(e, 'firstname')}
            />
            <SmartInputContainer
              type="text"
              name="user[lastname]"
              labelText="Last name"
              value={user.lastname}
              onChange={(e) => handleChange(e, 'lastname')}
            />
          </div>

          <div className='email'>
            <SmartInputContainer
              type="text"
              name="user[email]"
              labelText="Email"
              value={user.email}
              onChange={(e) => handleChange(e, 'email')}
              errors={errors.filter(x => x.toLowerCase().match(/email/))}
              note={"You can use letters, numbers & periods"}
            />
          </div>

          <div className='password'>
            <SmartInputContainer
              type="password"
              name="user[password]"
              labelText="Password"
              value={user.password}
              onChange={(e) => handleChange(e, 'password')}
              errors={errors.filter(x => x.toLowerCase().match(/password/))}
              note={"Use 8 or more characters with letters, numbers, or symbols"}
            />
          </div>

          <div className="bottom-bar">
            <Link className='link' to='/signin'>Sign in instead</Link>
            <input type='submit' value='Next'/>
          </div>
        </form>
    </SigninWrapper>
  );
}