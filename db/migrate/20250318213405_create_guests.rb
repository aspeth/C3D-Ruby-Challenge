class CreateGuests < ActiveRecord::Migration[7.1]
  def change
    create_table :guests do |t|
      t.string :name, null: false
      t.string :email, null: false

      t.timestamps
    end

    add_index :guests, :email
  end
end
