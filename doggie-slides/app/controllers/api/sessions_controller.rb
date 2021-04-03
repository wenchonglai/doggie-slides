class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])
    p [@user, params[:user][:email], params[:user][:password]]
    if @user
          p '------login-------'
      self.login!(@user)
      
      redirect_to api_user_url(@user)
    else
      render json: ['User does not exist']
    end
  end

  def destroy
    if !self.current_user
      render json: ['User not logged in!']
    else
      self.logout!
    end
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
