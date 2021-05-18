class Api::ShapesController < ApplicationController
  before_action :ensure_current_user

  def create
    @shape = Shape.new(shape_params);

    if @shape.save
      redirect_to api_shape_url(@shape), status: 303
    else
      render json: @shape.errors.full_messages, status: 422
    end
  end

  def update
    @shape = @shapes.find_by(id: params[:id].to_i);

    if !@shape
      render json: ["Shape not found"], status: 404
    elsif @shape.update(shape_params)
      redirect_to api_shape_url(@shape), status: 303
    else
      render json: @shape.errors.full_messages, status: 422
    end
  end

  def destroy
    @shape = @shapes.find_by(id: params[:id].to_i);

    if !@shape
      render json: ["shape not found"], status: 404
    elsif @shape.destroy
      redirect_to api_shapes_url, status: 303
    else
      render json: @shape.errors.full_messages, status: 422
    end
  end

  def show
    @shape = @shapes.find_by(id: params[:id])
  end

  private
  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this image"], status: 403
    else
      @user = User.includes(docs: [:slides]).find_by(id: current_user.id);
      @images = @user.images;

      unless @images
        render json: ["You are not authorized to visit this image"], status: 403
      end
    end
  end

  def shape_params
    params
      .require(:shape)
      .permit(
        :type, :path,
        wrapper_attributes: [
          :id, :slide_id, :group_id,
          :slide_object_id, :slide_object_type,
          :z_index, :width, :height,
          :x, :y, :rotate,
          :fill, :stroke, :stroke_width, :stroke_dasharray,
          '_destroy'
        ]
      )
  end
end
