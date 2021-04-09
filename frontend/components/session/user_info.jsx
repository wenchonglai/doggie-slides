import React from 'react';
import DropdownMenu from '../utils/dropdown_menu';

export default function UserInfo({user, logoutHandler, history}){
  const handleLogout = (e) => { 
    e.preventDefault();
    e.stopPropagation();
    logoutHandler();
    history.push('/slides/about');
  }
  
  const profile = (<div className="profile-image">{(user.firstname || '?')[0]}</div>);
  
  return (
    <DropdownMenu className='user-info'>
      {profile}
      <section>
        <section>
          <div className="user-profile">{profile}</div>
          <div className="user-name">{`${user.firstname} ${user.lastname}, wow~`}</div>
          <div className="user-email">{user.email}</div>
        </section>
        <section className='bottom-bar'>
          <button className='button' onClick={e => handleLogout(e)}>
            Sign Out
          </button>
        </section>
      </section>
    </DropdownMenu>
  )
}