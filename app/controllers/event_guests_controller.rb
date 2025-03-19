class EventGuestsController < ApplicationController
  def index
    @event = Event.find(params[:event_id])
    @guests = @event.guests

    render json: @guests
  end

  def create
    @event = Event.find(params[:event_id])

    # Find or create guest
    @guest = Guest.find_or_initialize_by(email: params[:email].downcase)
    @guest.name = params[:name] if @guest.new_record? || params[:update_existing]

    unless @guest.save
      return render json: { success: false, errors: @guest.errors.full_messages }, status: :unprocessable_entity
    end

    @event_guest = EventGuest.new(event_id: @event.id, guest_id: @guest.id)

    if @event_guest.save
      render json: {
        success: true,
        message: "Guest added successfully",
        guest: { id: @guest.id, name: @guest.name, email: @guest.email }
      }
    else
      render json: {
        success: false,
        errors: @event_guest.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  def destroy
    @event = Event.find(params[:event_id])
    @event_guest = @event.event_guests.find_by!(guest_id: params[:id])

    if @event_guest.destroy
      render json: { success: true, message: "Guest removed successfully" }
    else
      render json: { success: false, errors: @event_guest.errors.full_messages }, status: :unprocessable_entity
    end
  end
end