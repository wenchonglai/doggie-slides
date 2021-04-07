class Wrapper < ApplicationRecord
  before_validation :set_default_values

  validates :id, :slide_id, :object_id, :order, :type, :width, :height presence: true
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
