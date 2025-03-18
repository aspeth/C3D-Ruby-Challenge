class EventGuest < ApplicationRecord
  belongs_to :event
  belongs_to :guest

  validates :event_id, uniqueness: { scope: :guest_id }
end
