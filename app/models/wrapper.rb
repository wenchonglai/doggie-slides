# == Schema Information
#
# Table name: wrappers
#
#  id               :bigint           not null, primary key
#  group_id         :integer
#  slide_id         :integer          not null
#  object_id        :integer          not null
#  order            :integer          not null
#  type             :string           not null
#  width            :integer          default(150), not null
#  height           :integer          default(100), not null
#  transform_string :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
class Wrapper < ApplicationRecord
  before_validation :set_default_values

  validates :id, :slide_id, :object_id, :order, :type, :width, :height, presence: true
  validates :object_id, uniqueness: {scope: :type}

  delegate :user, to: :slide

  belongs_to :slide
  belongs_to :group
  belongs_to :object, polymorphic: true

  private def set_default_values
    self.width ||= 150
    self.height ||= 100
    self.transform_string ||= ""
  end
end
