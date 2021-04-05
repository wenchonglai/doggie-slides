# == Schema Information
#
# Table name: slides
#
#  id         :bigint           not null, primary key
#  doc_id     :integer          not null
#  order      :integer          not null
#  skipped    :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'byebug'
class Slide < ApplicationRecord
  before_validation :set_default_values
  validates :doc_id, :order, presence: true
  validates :skipped, inclusion: {in: [true, false]}

  belongs_to :doc
  delegate :user, to: :doc

  private
  def set_default_values
    self.skipped ||= false
  end
end
