require 'rails_helper'

RSpec.describe Guest, type: :model do
  describe 'validations' do
    it 'requires a name' do
      guest = Guest.new(email: 'john@example.com')
      expect(guest).not_to be_valid
      expect(guest.errors[:name]).to include("can't be blank")
    end

    it 'requires an email' do
      guest = Guest.new(name: 'John Doe')
      expect(guest).not_to be_valid
      expect(guest.errors[:email]).to include("can't be blank")
    end

    it 'requires a valid email format' do
      guest = Guest.new(
        name: 'John Doe',
        email: 'invalid-email'
      )
      expect(guest).not_to be_valid
      expect(guest.errors[:email]).to include('is invalid')
    end

    it 'is valid with valid attributes' do
      guest = Guest.new(
        name: 'John Doe',
        email: 'john@example.com'
      )
      expect(guest).to be_valid
    end
  end
end