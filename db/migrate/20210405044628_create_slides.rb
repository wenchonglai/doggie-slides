class CreateSlides < ActiveRecord::Migration[5.2]
  def change
    create_table :slides do |t|
      t.integer :doc_id, null: false
      t.integer :page, null: false, default: 1
      t.boolean :skipped, null: false, default: false
      t.string :background, default: "#ffffff"

      t.timestamps
    end

    add_index :slides, [:doc_id, :page]
  end
end
