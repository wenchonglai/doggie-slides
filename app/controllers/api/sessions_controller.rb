class Api::SessionsController < ApplicationController
  def create
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])
    if @user
      self.login!(@user)
      
      redirect_to api_user_url(@user), status: 303
    else
      render json: ['Wrong password. Try again.'], status: 404
    end
  end

  def destroy
    if !self.current_user
      render json: ['User not logged in!'], status: 422
    else
      self.logout!
    end
  end

  def user_params
    params.require(:user).permit(:email, :password)
  end
end
