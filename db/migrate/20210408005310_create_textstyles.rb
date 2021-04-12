class CreateTextstyles < ActiveRecord::Migration[5.2]
  def change
    create_table :textstyles do |t|
      t.integer :textbox_id, null: false
      t.text :style_string, null: false, default: ""
      t.integer :offset, null: false, default: 0

      t.timestamps
    end

    add_index :textstyles, :textbox_id
    add_index :textstyles, [:textbox_id, :offset]
  end
end
