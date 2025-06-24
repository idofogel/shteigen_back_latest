class CreateArches < ActiveRecord::Migration[8.0]
  def change
    create_table :arches do |t|
      t.string :caption
      t.integer :id_num
      t.integer :from
      t.integer :to
      t.integer :module

      t.timestamps
    end
  end
end
