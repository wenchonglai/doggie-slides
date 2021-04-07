# == Schema Information
#
# Table name: wrappers
#
#  id               :bigint           not null, primary key
#  group_id         :integer
#  slide_id         :integer          not null
#  object_id        :integer          not null
#  order            :integer          not null
#  type             :string           not null
#  width            :integer          default(150), not null
#  height           :integer          default(100), not null
#  transform_string :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
require 'test_helper'

class WrapperTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
