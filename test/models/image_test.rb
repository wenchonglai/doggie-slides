# == Schema Information
#
# Table name: images
#
#  id           :bigint           not null, primary key
#  width        :integer          default(0), not null
#  height       :integer          default(0), not null
#  x  :float            default(0.0), not null
#  y  :float            default(0.0), not null
#  rotate       :float            default(0.0), not null
#  scale_x      :float            default(0.0), not null
#  scale_y      :float            default(0.0), not null
#  style_string :string           default("")
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'test_helper'

class ImageTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
