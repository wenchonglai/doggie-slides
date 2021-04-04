export default function UserInfo({user, logoutHandler}){
  handleLogout(){ logoutHandler }
  return (
    <div className='user-info'>
      <div>
        <div className="user-profile"></div>
        <div className="user-name"></div>
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