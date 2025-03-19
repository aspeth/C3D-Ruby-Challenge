class Event < ApplicationRecord
  belongs_to :place
  has_many :event_guests, dependent: :destroy
  has_many :guests, through: :event_guests

  validates :name, presence: true
  validates :starts_at, presence: true
  validates :ends_at, presence: true
end
