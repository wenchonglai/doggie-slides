class CreateSlides < ActiveRecord::Migration[5.2]
  def change
    create_table :slides do |t|
      t.integer :doc_id, null: false
      t.integer :order, null: false
      t.boolean :skipped, null: false, default: false

      t.timestamps
    end

    add_index :slides, [:doc_id, :order], unique: true
  end
end
