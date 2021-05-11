class Api::UsersController < ApplicationController
  def index
    @user = User.includes(docs: [:slides]).find_by(id: current_user && current_user.id)
    render :index
  end

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

  def search
    @user = User.find_by(email: params[:email]);

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
