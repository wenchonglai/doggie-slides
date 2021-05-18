class CreateShapes < ActiveRecord::Migration[5.2]
  def change
    create_table :shapes do |t|
      t.string :type, null: false
      t.string :path, null: false
      t.timestamps
    end
  end
end
