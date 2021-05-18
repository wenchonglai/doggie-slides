class Shape < ApplicationRecord
  include SlideObject

  has_one :slide, through: :wrapper
  has_one :doc, through: :slide
  has_one_attached :file

end
