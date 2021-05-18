class Api::WrappersController < ApplicationController
  before_action :ensure_current_user

  def create
    @wrapper = Wrapper.new(wrapper_params)
    wrappers = @wrappers.where(slide_id: @wrapper.slide_id)
    wrapper.z_index = wrappers ? wrappers.order(z_index: :desc).limit(1).first.z_index : 0

    if @wrapper.save
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

  def sort_wrapper(slide_id)
    query = <<-SQL
      with ranks as (
        select id, row_number()
        over (order by z_index) as rank
        from wrappers
        where wrappers.slide_id = #{slide_id}
      ) 
      update wrappers
      set z_index = rank - 1
      from ranks
      where wrappers.id = ranks.id
    SQL

    ActiveRecord::Base.connection.execute(query);
  end

  def move
    slide_id = params[:wrapper][:slide_id].to_i
    wrapper_ids = params[:wrapper][:wrapper_ids]
    offset = params[:wrapper][:offset].to_i

    if wrapper_ids.length == 0
      render json: {}
    elsif sort_wrapper(slide_id)
      @slide_wrappers = @wrappers.where(slide_id: slide_id).order(:z_index)
      selected_wrappers = @slide_wrappers.where(id: wrapper_ids)
      selected_count = selected_wrappers.count

      if selected_count < wrapper_ids.length
        render json: ['wrappers forbidden or not found'], errors: 403
      else
        min_z = [selected_wrappers.first.z_index + (offset < 0 ? offset : 0), 0].max
        max_z = selected_wrappers.last.z_index + (offset > 0 ? offset : 0)

        affected_wrappers = @slide_wrappers.where("z_index >= ? and z_index <= ?", min_z, max_z)
        affected_count = affected_wrappers.count

        query1 = <<-SQL
          with ranks as (
            select id, row_number()
            over (order by z_index) as rank
            from wrappers
            where wrappers.slide_id = #{slide_id}
              and wrappers.z_index >= #{min_z}
              and wrappers.z_index <= #{max_z}
              and wrappers.id not in (#{wrapper_ids.join(', ')})
          ) 
          update wrappers
          set z_index = #{min_z + (offset < 0 ? selected_count : 0) } + rank - 1
          from ranks
          where wrappers.id = ranks.id;
        SQL

        query2 = <<-SQL
          with ranks as (
            select id, row_number()
            over (order by z_index) as rank
            from wrappers
            where wrappers.slide_id = #{slide_id}
              and wrappers.z_index >= #{min_z}
              and wrappers.z_index <= #{max_z}
              and wrappers.id in (#{wrapper_ids.join(', ')})
          ) 
          update wrappers
          set z_index = #{min_z + (offset > 0 ? (affected_count - selected_count) : 0)} + rank - 1
          from ranks
          where wrappers.id = ranks.id;
        SQL

        if ActiveRecord::Base.connection.execute(query1 + query2)
          render :move_index
        else
          render ['unprocessable entities'], errors: 422
        end
      end
    else
      render json: ['unprocessable entities'], errors: 422
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
      :x, :y, :width, :height, :rotate,
      :crop_x, :crop_y, :crop_width, :crop_height,
      :slide_object_id, :slide_object_type,
      :shape, :shape_path, 
      :fill, :stroke, :stroke_width, :stroke_dasharray
    )
  end

  def wrapper_move_params
    params.require(:wrapper).permit(:start, :end, :offset, :slide_id)
  end
end
