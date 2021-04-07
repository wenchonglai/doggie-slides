class CreateTextStyles < ActiveRecord::Migration[5.2]
  def change
    create_table :text_styles do |t|
      t.integer :textbox_id, null: false
      t.text :style_string, null: false, default: ""
      t.integer :offset, null: false, default: 0

      t.timestamps
    end

    add_index :text_styles, :textbox_id
    add_index :text_styles, [:textbox_id, :offset], unique: true
  end
end
