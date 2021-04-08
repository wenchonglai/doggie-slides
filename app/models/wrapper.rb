# == Schema Information
#
# Table name: wrappers
#
#  id                :bigint           not null, primary key
#  group_id          :integer
#  slide_id          :integer          not null
#  slide_object_type :string
#  slide_object_id   :bigint
#  sequence          :integer          not null
#  width             :integer          default(150), not null
#  height            :integer          default(100), not null
#  transform_string  :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Wrapper < ApplicationRecord
  before_validation :set_default_values

  validates :slide_id, :sequence, :width, :height, presence: true

  delegate :user, to: :slide

  belongs_to :slide, touch: true

  belongs_to :slide_object, polymorphic: true, inverse_of: :wrapper

  validates_presence_of :slide_object

  private def set_default_values
    self.width ||= 150
    self.height ||= 100
    self.transform_string ||= ""
  end
end
