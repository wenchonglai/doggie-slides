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
#  x       :float            default(0.0), not null
#  y       :float            default(0.0), not null
#  rotate            :float            default(0.0), not null
#  fill              :string
#  stroke            :string
#  stroke_width      :float            default(0.0)
#  stroke_dasharray  :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#
require 'test_helper'

class WrapperTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
