# == Schema Information
#
# Table name: wrappers
#
#  id                :bigint           not null, primary key
#  group_id          :integer
#  slide_id          :integer          not null
#  slide_object_type :string
#  slide_object_id   :bigint
#  z_index           :integer          not null
#  width             :float            default(300.0), not null
#  height            :float            default(200.0), not null
#  translate_x       :float            default(0.0), not null
#  translate_y       :float            default(0.0), not null
#  rotate            :float            default(0.0), not null
#  fill              :string
#  stroke            :string
#  stroke_width      :float            default(0.0)
#  stroke_dasharray  :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Wrapper < ApplicationRecord
  before_validation :set_default_values

  validates :slide_id, :z_index, :width, :height, :translate_x, :translate_y, :rotate, presence: true

  delegate :user, :doc, to: :slide

  belongs_to :slide, touch: true, inverse_of: :wrappers
  belongs_to :slide_object, polymorphic: true, inverse_of: :wrapper, dependent: :destroy

  validates_presence_of :slide_object

  private def set_default_values
    self.width ||= 300.0
    self.height ||= 200.0
    self.translate_x ||= 0.0
    self.translate_y ||= 0.0
    self.rotate ||= 0.0
    self.stroke_width ||= 0.0
  end
end
