nullUser = {
  id: nil,
  email: nil
}

json.extract!(
  ( (@user && @user.session_token === session[:session_token]) ?
      @user :
      nullUser
  ), :id, :email
)
