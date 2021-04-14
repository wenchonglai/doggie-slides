class Api::ImagesController < ApplicationController
  before_action :ensure_current_user

  def create
    @image = Image.create(image_params);

    if @image.save!
      redirect_to api_text_url(@image), status: 303
    else
      render json: @image.errors.full_messages, status: 422
    end
  end

  def update
    @image = @images.find_by(id: params[:id].to_i);

    if !@image
      render json: ["Image not found"], status: 404
    elsif @image.update(image_params)
      redirect_to api_image_url(@image), status: 303
    else
      render json: @image.errors.full_messages, status: 422
    end
  end

  def destroy
    @image = @images.find_by(id: params[:id].to_i);

    if !@image
      render json: ["image not found"], status: 404
    elsif @image.destroy
      redirect_to api_texts_url, status: 303
    else
      render json: @image.errors.full_messages, status: 422
    end
  end

  def show
    @image = @images.find_by(id: params[:id])
  end

  private
  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this slide"], status: 403
    else
      @user = User.includes(docs: [:slides]).find_by(id: current_user.id);
      @images = @user.images;

      unless @images
        render json: ["You are not authorized to visit this slide"], status: 403
      end
    end
  end

  def image_params
    params
      .require(:image)
      .permit(
        :width, :height,
        :translate_x, :translate_y,
        :scale_x, :scale_y,
        :rotate
        :style_string
        wrapper_attributes: [
          :id, :slide_id, :group_id,
          :slide_object_id, :slide_object_type,
          :z_index, :width, :height,
          :translate_x, :translate_y, :rotate,
          :fill, :stroke, :stroke_width, :stroke_dasharray,
          '_destroy'
        ]
      )
  end
end
