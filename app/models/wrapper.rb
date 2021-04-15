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
#  x                 :float            default(0.0), not null
#  y                 :float            default(0.0), not null
#  rotate            :float            default(0.0), not null
#  fill              :string
#  stroke            :string
#  stroke_width      :float            default(0.0)
#  stroke_dasharray  :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
class Wrapper < ApplicationRecord
  attr_accessor :skip_set_dimensions

  before_validation :set_default_values
  after_commit ({unless: :skip_set_dimensions}) { |wrapper| set_dimensions(wrapper) }

  validates(
    :slide_id, :z_index, 
    :x, :y, :width, :height, :rotate,
    :crop_x, :crop_y, :crop_width, :crop_height,
    {presence: true}
  )

  delegate :user, :doc, to: :slide

  belongs_to :slide, touch: true, inverse_of: :wrappers
  belongs_to :slide_object, polymorphic: true, inverse_of: :wrapper, dependent: :destroy

  validates_presence_of :slide_object

  private 
  def set_default_values
    self.width ||= 300.0
    self.height ||= 200.0
    self.x ||= 0.0
    self.y ||= 0.0
    self.crop_x ||= 0
    self.crop_y ||= 0
    self.crop_width ||= 0
    self.crop_height ||= 0
    self.rotate ||= 0.0
    self.stroke_width ||= 0.0
  end

  def set_dimensions(wrapper)
    if wrapper.width && wrapper.height
      wrapper.crop_width = wrapper.width if wrapper.crop_width.zero?
      wrapper.crop_height = wrapper.height if wrapper.crop_height.zero?
      wrapper.skip_set_dimensions = true
      wrapper.save!
    end
  end
end
