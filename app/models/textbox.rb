# == Schema Information
#
# Table name: textboxes
#
#  id         :bigint           not null, primary key
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Textbox < ApplicationRecord
  include SlideObject

  before_validation :set_default_values

  has_many :textstyles, dependent: :destroy, inverse_of: :textbox
  has_one :slide, through: :wrapper

  accepts_nested_attributes_for :textstyles, allow_destroy: true

  private 
  def set_default_values
    self.text ||= ""
  end
end
