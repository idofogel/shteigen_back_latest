class CreateModulekinds < ActiveRecord::Migration[8.0]
  def change
    create_table :modulekinds do |t|
      t.string :caption
      t.integer :id_num

      t.timestamps
    end
  end
end
