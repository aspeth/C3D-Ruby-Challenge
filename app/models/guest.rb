class Guest < ApplicationRecord
  has_many :event_guests, dependent: :destroy
  has_many :events, through: :event_guests

  validates :name, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
end
