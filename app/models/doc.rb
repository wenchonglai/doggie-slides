# == Schema Information
#
# Table name: docs
#
#  id         :bigint           not null, primary key
#  owner_id   :integer          not null
#  share_id   :integer
#  filename   :string           default("Untitled presentation"), not null
#  width      :integer          default(960), not null
#  height     :integer          default(540), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class Doc < ApplicationRecord
  before_validation :set_default_values
  after_create :ensure_slide!
  validates :owner_id, :filename, :width, :height, presence: true

  belongs_to :user, foreign_key: :owner_id, class_name: :User
  has_many :slides, dependent: :destroy

  private 
  def set_default_values
    self.filename ||= "Dis doc, so untitled. wow~"
    self.width ||= 960
    self.height ||= 540
  end

  def ensure_slide!
    Slide.create!({doc_id: self.id})
  end
end
