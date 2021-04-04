import React from 'react';

export default function UserInfo({user, logoutHandler, history}){
  function handleLogout(){ 
    logoutHandler();
    history.push('/slides/about');
  }

  return (
    <div className='user-info'>
      <div>
        <div className="user-profile">{(user.firstname || '?')[0]}</div>
        <div className="user-name">{user.firstname}</div>
        <div className="user-email">{user.email}</div>
      </div>
      <div>
        <button onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </div>
  )
}