# == Schema Information
#
# Table name: textstyles
#
#  id           :bigint           not null, primary key
#  textbox_id   :integer          not null
#  style_string :text             default(""), not null
#  offset       :integer          default(0), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
require 'test_helper'

class TextstyleTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
