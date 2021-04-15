# == Schema Information
#
# Table name: images
#
#  id           :bigint           not null, primary key
#  width        :integer          default(0), not null
#  height       :integer          default(0), not null
#  x            :float            default(0.0), not null
#  y            :float            default(0.0), not null
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
  before_validation :set_default_values
  after_commit ({unless: :skip_set_dimensions}) { |image| set_dimensions(image) }
  
  has_one :slide, through: :wrapper
  has_one :doc, through: :slide
  has_one_attached :file

  private 
  def set_default_values
    self.width ||= 0
    self.height ||= 0
    self.x ||= 0.0
    self.y ||= 0.0
    self.rotate ||= 0.0
    self.scale_x ||= 1.0
    self.scale_y ||= 1.0
    self.style_string ||= ""
  end

  def set_dimensions(image)
    if Image.exists?(image.id)
      wrapper = image.wrapper

      if wrapper && image.file.attached?
        doc_width = image.doc.width
        doc_height = image.doc.height
        doc_w_h_ratio = doc_width / doc_height.to_f

        meta = ActiveStorage::Analyzer::ImageAnalyzer.new(image.file).metadata
        width = meta[:width]
        height = meta[:height]
        w_h_ratio = width / height.to_f

        scale = 1.0

        if height > doc_height && doc_w_h_ratio > w_h_ratio
          scale = doc_height / height.to_f
        elsif width > doc_width && doc_w_h_ratio <= w_h_ratio
          scale = doc_width / width.to_f
        end

        image.width = width
        image.height = height
        image.scale_x = scale
        image.scale_y = scale
        image.skip_set_dimensions = true
        image.save!

        if wrapper.width == 0.0 || wrapper.height == 0.0
          wrapper.crop_width = width * scale
          wrapper.crop_height = height * scale
          wrapper.width = width * scale
          wrapper.height = height * scale
          wrapper.save!
        end
      else
        image.width = 0
        image.height = 0
        #NB: do not do image.save! otherwise it will create a commit and trigger an infinite loop
        
        if wrapper
          wrapper.width = 0.0
          wrapper.height = 0.0
        end
      end
    end
  end
end
