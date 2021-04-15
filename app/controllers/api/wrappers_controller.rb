class Api::WrappersController < ApplicationController
  before_action :ensure_current_user

  def create
    @wrapper = Wrapper.new(wrapper_params)

    if (@wrapper.save)

      @wrappers
        .where("z_index >= ? and slide_id == ? id <> ?", @wrapper.z_index, @wrapper.slide_id, @wrapper.id)
        .in_batches.update_all("z_index = z_index + 1");

      redirect_to api_wrappers_url, status: 303
    else
      render json: @wrapper.errors.full_messages, status: 422
    end
  end

  def update
    @wrapper = @wrappers.find_by(id: params[:id])
    
    if @wrapper
      slides = @wrapper.doc.slides
      slide_id = @wrapper.slide_id.to_i

      if @wrapper.slide_object_id != wrapper_params[:slide_object_id].to_i ||
            @wrapper.slide_object_type != wrapper_params[:slide_object_type]
        render({
          json: ["To change the content of a wrapper, use the corresponding content request URLs instead"],
          status: 403
        })
      elsif !slides.find_by(id: slide_id)
        render json: ["Cannot move a wrapper to another document"], status: 403
      elsif @wrapper.z_index != params[:wrapper][:z_index].to_i
        render({
          json: ["To change the order of a wrapper, use UPDATE /api/wrappers/move for this action"],
          status: 403
        })
      elsif @wrapper.update(wrapper_params)
        new_z = @wrapper.z_index

        redirect_to api_wrapper_url(@wrapper), status: 303
      else
        render json: @wrapper.errors.full_messages, status: 422
      end
    else
      render json: ["Wrapper not found"], status: 404
    end
  end

  def destroy
    @wrapper = @wrappers.find_by(id: params[:id]);

    if !@wrapper
      render json: ['@Wrapper not found'], status: 404
    elsif @wrapper.destroy
      @wrappers
        .where("z_index >= ? and slide_id = ?", @wrapper.z_index, @wrapper.slide_id)
        .in_batches.update_all("z_index = z_index - 1");
        
      redirect_to api_wrappers_url, status: 303
    else
      render json: @wrapper.errors.full_messages, status: 422
    end
  end

  def move
    wrappers = @wrapper.where(slide_id: slide_id)
    count = wrappers.count
    start_z = wrapper_move_params[:start].to_i
    end_z = wrapper_move_params[:end].to_i
    length = end_z - start_z + 1
    offset = wrapper_move_params[:offset].to_i

    if length < 1 || start_z <= 0 || start_z + offset <= 0 || end_z > count || end_z + offset > count
      render json: ["Invalid wrapper move parameter {start_z: #{start_z}), end_z: #{end_z}, offset: #{offset}"], status: 422
    else
      wrappers.where("z_index >= ? and z_index <= ?", start_z, end_z)
        .in_batches.update_all("z_index = -z_index - #{offset}")
        
      if (offset < 0)
        wrappers.where("z_index >= ? and z_index < ?", start_z + offset, start_z)
          .in_batches.update_all("z_index = z_index + #{length}")
      elsif (offset > 0)
        wrappers.where("z_index > ? and z_index <= ?", end_z, end_z + offset)
          .in_batches.update_all("z_index = z_index - #{length}")
      end

      wrappers.where("z_index < 0")
        .in_batches.update_all("z_index = -z_index")

      redirect_to api_wrappers_url, status: 303
    end
  end
  
  def show
    @wrapper = @wrappers.find_by(id: params[:id])
    render :show
  end

  def index
    render :index
  end

  private
  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this wrapper"], status: 403
    else
      @user = User.includes(docs: [:slides]).find_by(id: current_user.id);
      @wrappers = @user.wrappers;
  
      unless @wrappers
        render json: ["You are not authorized to visit this wrapper"], status: 403
      end
    end
  end

  def wrapper_params
    params.require(:wrapper).permit(
      :id, :slide_id, :group_id,
      :z_index, :x, :y, :width, :height, :rotate,
      :crop_x, :crop_y, :crop_width, :crop_height,
      :slide_object_id, :slide_object_type,
      :fill, :stroke, :stroke_width, :stroke_dasharray
    )
  end

  def wrapper_move_params
    params.require(:wrapper).permit(:start, :end, :offset, :slide_id)
  end
end
