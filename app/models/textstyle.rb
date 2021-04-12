#=== Schema Information
#
# Table name: textstyles
#
#  id           :bigint           not null, primary key
#  textbox_id   :integer          not null
#  style_string :text             default(""), not null
#  offset       :integer          default(0), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
class Textstyle < ApplicationRecord
  validates :style_string, :offset, presence: true
  # validates :offset, uniqueness: {scope: :textbox_id}

  belongs_to :textbox, inverse_of: :textstyles
  validates_presence_of :textbox

  delegate :user, to: :textbox

  private 
  def set_default_values
    self.style_string = "14px Times"
    self.offset ||= 0
  end
end
