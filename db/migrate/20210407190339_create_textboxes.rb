class CreateTextboxes < ActiveRecord::Migration[5.2]
  def change
    create_table :textboxes do |t|
      t.text :text, null: false

      t.timestamps
    end
  end
end
