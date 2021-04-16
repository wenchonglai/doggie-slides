class CreateWrappers < ActiveRecord::Migration[5.2]
  def change
    create_table :wrappers do |t|
      t.integer :group_id
      t.integer :slide_id, null: false
      t.references :slide_object, polymorphic: true
      t.integer :z_index, null: false, default: 0
      t.float :width, null: false, default: 0.0
      t.float :height, null: false, default: 0.0
      t.float :x, null: false, default: 0.0
      t.float :y, null: false, default: 0.0
      t.float :rotate, null: false, default: 0.0
      t.float :crop_width, null: false, default: 0.0
      t.float :crop_height, null: false, default: 0.0
      t.float :crop_x, null: false, default: 0.0
      t.float :crop_y, null: false, default: 0.0
      t.string :fill
      t.string :stroke
      t.float :stroke_width, default: 0.0
      t.string :stroke_dasharray
      t.timestamps
    end

    add_index :wrappers, :group_id
    add_index :wrappers, :slide_id
    add_index :wrappers, [:slide_id, :z_index]
  end
end
