class CreateImages < ActiveRecord::Migration[5.2]
  def change
    create_table :images do |t|
      t.integer :width, null: false, default: 0
      t.integer :height, null: false, default: 0
      t.float :translate_x, null: false, default: 0
      t.float :translate_y, null: false, default: 0
      t.float :rotate, null: false, default: 0
      t.float :scale_x, null: false, default: 0
      t.float :scale_y, null: false, default: 0
      t.string :style_string, default: ""

      t.timestamps
    end
  end
end
