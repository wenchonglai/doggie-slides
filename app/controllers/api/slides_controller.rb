class Api::SlidesController < ApplicationController
  before_action :ensure_current_user

  def create
    @slide = Slide.new(slide_params)

    if (@slide.save)

      @slides
        .where("page >= ? and id <> ?", @slide.page, @slide.id)
        .in_batches.update_all("page = page + 1");

      redirect_to api_slides_url, status: 303
    else
      render json: @slide.errors.full_messages, status: 422
    end
  end

  def update

    @slide = @slides.find_by(id: params[:id])

    if @slide
      if (@slide.doc_id != params[:slide][:doc_id].to_i)
        render json: ["Cannot move a slide to another document"], status: 403
      elsif (@slide.page != params[:slide][:page].to_i)
        render json: ["Cannot change page number using this action"], status: 403
      elsif (@slide.update(slide_params))
        new_page = @slide.page
        # if (new_page > old_page)
        #   @slides
        #     .where("page > ? and page <= ? and id <> ?", old_page, new_page, @slide.id)
        #     .in_batches.update_all("page = page - 1");
        # elsif (new_page < old_page)
        #   @slides
        #     .where("page < ? and page >= ? and id <> ?", old_page, new_page, @slide.id)
        #     .in_batches.update_all("page = page + 1");
        # end

        redirect_to api_slide_url(@slide), status: 303
      else
        render json: @slide.errors.full_messages, status: 422
      end
    else
      render json: ["Slide not found"], status: 404
    end
  end

  def destroy
    if @slides.count == 1
      render json: ['Cannot delete the last slide'], status: 403
    else 
      @slide = @slides.find_by(id: params[:id]);
      if @slide
        if @slide.destroy
          @slides
            .where("page >= ?", @slide.page)
            .in_batches.update_all("page = page - 1");
            
          redirect_to api_slides_url, status: 303
        else
          render json: @slide.errors.full_messages, status: 422
        end
      else
        render json: ['Slide not found'], status: 404
      end
    end
  end

  def move
    count = @slides.count
    startPage = slide_move_params[:start].to_i
    endPage = slide_move_params[:end].to_i
    length = endPage - startPage + 1
    offset = slide_move_params[:offset].to_i

    if length < 1 || startPage <= 0 || startPage + offset <= 0 || endPage > count || endPage + offset > count
      render json: ["Invalid slide move parameter {startPage: #{startPage}), endPage: #{endPage}, offset: #{offset}"], status: 422
    else
      @slides.where("page >= ? and page <= ?", startPage, endPage)
        .in_batches.update_all("page = -page - #{offset}")
      if (offset < 0)
        @slides.where("page >= ? and page < ?", startPage + offset, startPage)
          .in_batches.update_all("page = page + #{length}")
      elsif (offset > 0)
        @slides.where("page > ? and page <= ?", endPage, endPage + offset)
          .in_batches.update_all("page = page - #{length}")
      end

      @slides.where("page < 0")
        .in_batches.update_all("page = -page")

      redirect_to api_slides_url, status: 303
    end
  end
  
  def show
    @slide = @slides.find_by(id: params[:id])
    render :show
  end

  def show_content
    @slide = @slides.find_by(id: params[:id])
    render :show_content
  end

  def index
    render :index
  end

  private
  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this slide"], status: 403
    else
      @user = User.includes(docs: [:slides]).find_by(id: current_user.id);
      @doc = @user.docs.first
      @slides = @doc.slides;
  
      unless @slides
        render json: ["You are not authorized to visit this slide"], status: 403
      end
    end
  end

  def grow_page!
    @slides
      .where("page >= ?", params[:slide][:page])
      .in_batches.update_all("page = page + 1");

  end
  def shrink_page!
    @slides.where("page > ?", @old_page)
      .in_batches.update_all("page = page - 1");
  end

  def rerank!
    doc_id = @doc.id
    doc_id = 1

    if (doc_id.is_a? Numeric)
      query = <<-SQL
        with ranks as (
          select id, row_number()
          over (order by page) as rank
          from slides
          where slides.doc_id = #{doc_id}
        ) 
        update slides
        set page = rank - 1
        from ranks
        where slides.id = ranks.id;
      SQL

      ActiveRecord::Base.connection.execute(query);
    end
  end

  def slide_params
    params.require(:slide).permit(
      :id, :doc_id, :page, :skipped,
      wrappers_attributes: [
        :id, :_destroy
      ]
    );
  end

  def slide_move_params
    params.require(:slide).permit(:start, :end, :offset)
  end
end