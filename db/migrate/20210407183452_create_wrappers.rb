class CreateWrappers < ActiveRecord::Migration[5.2]
  def change
    create_table :wrappers do |t|
      t.integer :group_id
      t.integer :slide_id, null: false
      t.references :slide_object, polymorphic: true
      t.integer :z_index, null: false
      t.float :width, null: false, default: 300.0
      t.float :height, null: false, default: 200.0
      t.float :translate_x, null: false, default: 0.0
      t.float :translate_y, null: false, default: 0.0
      t.float :rotate, null: false, default: 0.0
      t.timestamps
    end

    add_index :wrappers, :group_id
    add_index :wrappers, :slide_id
  end
end
