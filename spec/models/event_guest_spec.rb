require 'rails_helper'

RSpec.describe EventGuest, type: :model do
  describe 'validations' do
    it 'requires an event' do
      guest = Guest.create!(name: 'John Doe', email: 'john@example.com')
      event_guest = EventGuest.new(guest: guest)
      expect(event_guest).not_to be_valid
      expect(event_guest.errors[:event]).to include("must exist")
    end

    it 'requires a guest' do
      place = Place.create!(name: 'Test Place')
      event = Event.create!(
        name: 'Test Event',
        starts_at: Time.current,
        ends_at: Time.current + 1.hour,
        place: place
      )
      event_guest = EventGuest.new(event: event)
      expect(event_guest).not_to be_valid
      expect(event_guest.errors[:guest]).to include("must exist")
    end

    it 'prevents duplicate event/guest combinations' do
      place = Place.create!(name: 'Test Place')
      event = Event.create!(
        name: 'Test Event',
        starts_at: Time.current,
        ends_at: Time.current + 1.hour,
        place: place
      )
      guest = Guest.create!(name: 'John Doe', email: 'john@example.com')

      EventGuest.create!(event: event, guest: guest)
      duplicate = EventGuest.new(event: event, guest: guest)

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:event_id]).to include("This guest is already registered for this event.")
    end

    it 'is valid with valid attributes' do
      place = Place.create!(name: 'Test Place')
      event = Event.create!(
        name: 'Test Event',
        starts_at: Time.current,
        ends_at: Time.current + 1.hour,
        place: place
      )
      guest = Guest.create!(name: 'John Doe', email: 'john@example.com')
      
      event_guest = EventGuest.new(event: event, guest: guest)
      expect(event_guest).to be_valid
      expect(event_guest.errors).to be_empty
    end
  end
end 