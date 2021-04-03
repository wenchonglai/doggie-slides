require 'byebug'
class ApplicationController < ActionController::Base
  helper_method :current_user

  def current_user
    @current_user ||= User.find_by(session_token: session[:session_token])
  end

  def ensure_logged_in
    redirect_to api_users_url, status: 303 unless logged_in?
  end

  def logged_in?
    !!self.current_user
  end

  def login!(user)
    session[:session_token] = user.reset_session_token!
  end

  def logout!
    @current_user.reset_session_token!
    @current_user = nil
    session[:session_token] = nil

    redirect_to api_users_url, status: 303
  end
end
