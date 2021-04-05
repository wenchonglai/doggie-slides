nullUser = {
  id: nil,
  firstname: nil,
  lastname: nil,
  email: nil,
}

user = (@user && @user.session_token === session[:session_token]) ?
  @user :
  nullUser

json.partial! "user", user: user