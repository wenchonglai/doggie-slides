import React from 'react';
import {Link} from 'react-router-dom';
import SigninWrapper from './signin_wrapper';

import SmartInput from './smart_input';

// export default function SigninPage(props){

//   return (
//     <section>
//       Hi #name
//       email@email.com
//       <form onSubmit={(e) => handleSubmit(e)}>
//         <div>
//           <input type="password"/>
//           <div>Enter your password</div>
//           <label>
//             <input type="checkbox"/>
//             Show password
//           </label>
//         </div>
//         {/*Forgot Password? -> Fake an email*/}
//         <input type='submit' value='Next'/>
//       </form>
//     </section>
//   );
// }

export default function SigninPasswordPage({history, login}){
  let localStorageObject = JSON.parse(localStorage.getItem("doggieSlides")) || {user: {}};
  const [user, setUser] = React.useState(
    {...localStorageObject.user, password: ""}
  );

  function handleSubmit(e){
    // props.history.push('/signin/challenge')
    e.preventDefault();
    login(user).then(res => {
      history.push('/presentation');
    });
  }

  function handleChange(e){
    setUser({...user, password: e.target.value});
  }

  return (
    <SigninWrapper>
        <h1>{`Hi, ${user.email.split('@')[0]}`}</h1>
        <div className='heading-subtext'>{user.email}</div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <SmartInput
            type="password"
            name="user[password]"
            labelText="Enter your password"
            value={user.password}
            onChange={(e) => handleChange(e)}
          >
            {/* <div className="body-subtext">
              Forgot your password? Use Demo user to sign in privately.
              <Link className='link' to='#'>Demo User</Link>
            </div> */}
          </SmartInput>


          <div className="bottom-bar">
            <Link className='link' to='/signup/identifier'>Forgot password</Link>
            <input type='submit' value='Next'/>
          </div>
        </form>
    </SigninWrapper>
  );
}