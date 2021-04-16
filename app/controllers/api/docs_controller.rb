class Api::DocsController < ApplicationController
  before_action :ensure_current_user

  def update
    @doc = Doc.find_by(id: params[:id])

    if @doc
      if @doc.update(doc_params)
        redirect_to api_doc_url(params[:id]), status: 303
      else
        render json: @doc.errors.full_messages, status: 422
      end
    else
      render json: ['Document not found'], status: 404
    end
  end

  def show
  end

  private 
  def doc_params
    params.require(:doc).permit(:id, :owner_id, :filename, :width, :height)
  end

  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this doc"], status: 403
    else
      @user = User.includes(:docs).find_by(id: current_user.id);
      @doc = @user.docs.first
  
      unless @doc
        render json: ["You are not authorized to visit this doc"], status: 403
      end
    end
  end
end
