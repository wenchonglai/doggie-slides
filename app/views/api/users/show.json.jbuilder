nullUser = {
  id: nil,
  firstname: nil,
  lastname: nil,
  email: nil
}

json.partial! "user", user: 
  (@user && @user.session_token === session[:session_token]) ?
    @user :
    nullUser