class CreateWrappers < ActiveRecord::Migration[5.2]
  def change
    create_table :wrappers do |t|
      t.integer :group_id
      t.integer :slide_id, null: false
      t.references :slide_object, polymorphic: true
      t.integer :sequence, null: false
      t.integer :width, null: false, default: 150
      t.integer :height, null: false, default: 100
      t.string :transform_string

      t.timestamps
    end

    add_index :wrappers, :group_id
    add_index :wrappers, :slide_id
  end
end
