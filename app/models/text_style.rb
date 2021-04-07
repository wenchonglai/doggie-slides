# == Schema Information
#
# Table name: text_styles
#
#  id           :bigint           not null, primary key
#  textbox_id   :integer          not null
#  style_string :text             default(""), not null
#  offset       :integer          default(0), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class TextStyle < ApplicationRecord
  validates :textbox_id, :style_string, :offset, presence: true
  validates :offset, uniqueness: {scope: :textbox_id}

  belongs_to :textbox

  delegate :user, to: :textbox

  private 
  def set_default_values
    self.style_string = ""
    self.offset ||= 0
  end
end
