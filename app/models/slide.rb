# == Schema Information
#
# Table name: slides
#
#  id         :bigint           not null, primary key
#  doc_id     :integer          not null
#  page      :integer          not null
#  skipped    :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

#

class Slide < ApplicationRecord
  before_validation :set_default_values
  validates :doc_id, :page, presence: true
  validates :skipped, inclusion: {in: [true, false]}

  belongs_to :doc
  delegate :user, to: :doc

  has_many :wrappers

  private
  def set_default_values
    self.skipped ||= false
    self.page ||= 1
  end
end
