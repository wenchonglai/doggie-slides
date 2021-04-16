# == Schema Information
#
# Table name: slides
#
#  id         :bigint           not null, primary key
#  doc_id     :integer          not null
#  page       :integer          default(1), not null
#  skipped    :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

#

class Slide < ApplicationRecord
  before_validation :set_default_values
  validates :doc_id, :page, presence: true
  validates :skipped, inclusion: {in: [true, false]}
  
  belongs_to :doc, touch: true
  delegate :user, to: :doc
  
  has_many :wrappers, dependent: :destroy, inverse_of: :slide
  has_many :textboxes, through: :wrappers, source: :slide_object, source_type: 'Textbox'
  has_many :images, through: :wrappers, source: :slide_object, source_type: 'Image'
  has_many :textstyles, through: :textboxes
  
  accepts_nested_attributes_for :wrappers, allow_destroy: true

  private
  def set_default_values
    self.skipped ||= false
    self.page ||= 1
  end
end
