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
  before_validation :set_default_values

  validates :text, presence: true

  has_many :text_styles, dependent: :destroy
  has_one :wrapper, dependent: :destroy

  delegate :user, to: :wrapper

  private 
  def set_default_values
    self.text ||= ""
  end
end
