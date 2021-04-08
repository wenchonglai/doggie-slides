class Api::TextboxesController < ApplicationController
  after_action :create_textstyle
  
  def show
    @textbox = Textbox.find_by(id: params[:id])
  end

  def create
    p params[:textbox][:text]
    @textbox = Textbox.new(text: params[:textbox][:text])

    if @textbox.save
      redirect_to textbox_url(@textbox), status: 303
    else
      render @textbox.errors.full_messages
    end

  end

  def update

  end

  def destroy

  end

  private
  def textbox_params
    params.require(:textbox).permit(:text, :styles)
  end

  def ensure_current_user
    if !current_user
      render json: ["You are not authorized to visit this slide"], status: 403
    else
      @textbox = Textbox.find_by(id: params[:id])
  
      # unless @textbox.user == 
      #   render json: ["You are not authorized to visit this slide"], status: 403
      # end
    end
  end

  def create_textstyle
    # @textstyle_ids = []

    # params[:textstyles].each do |textstyle|
    #   textstyle = TextStyle.new(
    #     textbox_id: @textbox.id,
    #     style_string: textstyle.style_string,
    #     offset: textstyle.offset.to_i
    #   );
      
    #   if textstyle.save
    #   else
        
    #   end
    # end
    return false
  end
end
