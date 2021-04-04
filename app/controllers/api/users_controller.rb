class Api::UsersController < ApplicationController
  # def index
  #   @current_user = self.current_user
  # end

  def create
    @user = User.new(user_params)

    if @user.save
      self.login!(@user)
      render :show
    else
      render json: @user.errors.full_messages, status: 422
    end
  end

  def destroy
    @user = User.find_by(id: params[:id])
    
    if !@user
      render json: ['DoggIe Account does not exist'], status: 404
    else 
      self.logout!

      if @user.destroy
        redirect_to api_users_url
      else
        render json: @user.errors.full_messages, status: 422
      end
    end
  end

  def show
    @user = User.find_by(id: params[:id])
  end

  def index
  end

  def search
    @user = User.find_by(email: params[:user][:email]);

    if @user
      render :user_found
    else
      render json: ["Couldn't find your DoggIe Account"], status: 404
    end
  end

  def user_params
    params.require(:user).permit(:email, :password, :firstname, :lastname);
  end
end
