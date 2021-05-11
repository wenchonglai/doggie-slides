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
require 'test_helper'

class DocTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
