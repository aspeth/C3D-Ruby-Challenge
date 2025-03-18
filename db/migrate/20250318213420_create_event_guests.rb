class CreateEventGuests < ActiveRecord::Migration[7.1]
  def change
    create_table :event_guests do |t|
      t.references :event, null: false, foreign_key: true
      t.references :guest, null: false, foreign_key: true

      t.timestamps
    end

    add_index :event_guests, [:event_id, :guest_id], unique: true
  end
end
