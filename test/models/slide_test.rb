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
require 'test_helper'

class SlideTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
