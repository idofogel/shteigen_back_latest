class CreateNodes < ActiveRecord::Migration[8.0]
  def change
    create_table :nodes do |t|
      t.string :caption
      t.text :content
      t.integer :id_num
      t.integer :module
      t.integer :level

      t.timestamps
    end
  end
end
