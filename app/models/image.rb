# == Schema Information
#
# Table name: images
#
#  id           :bigint           not null, primary key
#  width        :integer          default(0), not null
#  height       :integer          default(0), not null
#  translate_x  :float            default(0.0), not null
#  translate_y  :float            default(0.0), not null
#  rotate       :float            default(0.0), not null
#  scale_x      :float            default(0.0), not null
#  scale_y      :float            default(0.0), not null
#  style_string :string           default("")
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Image < ApplicationRecord
  include SlideObject

  attr_accessor :skip_set_dimensions
  after_commit ({unless: :skip_set_dimensions}) { |image| set_dimensions(image) }
  
  has_one :slide, through: :wrapper
  has_one_attached :file

  private 
  def set_dimensions(image)
    if (Image.exists?(image.id))

      if (image.file.attached?)
        meta = ActiveStorage::Analyzer::ImageAnalyzer.new(image.file).metadata

        image.width = meta[:width]
        image.height = meta[:height]
        image.skip_set_dimensions = true
        image.save!
      else
        image.width = 0
        image.height = 0
      end

      p image
    end
  end
end
