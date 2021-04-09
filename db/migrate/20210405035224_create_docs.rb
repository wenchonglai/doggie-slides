class CreateDocs < ActiveRecord::Migration[5.2]
  def change
    create_table :docs do |t|
      t.integer :owner_id, null: false
      t.integer :share_id
      t.string :filename, null: false, default: "Untitled presentation"
      t.integer :width, null: false, default: 800
      t.integer :height, null: false, default: 500

      t.timestamps
    end

    add_index :docs, :owner_id
    add_index :docs, :share_id
  end
end
