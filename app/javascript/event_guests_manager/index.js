import React from 'react';
import ReactDOM from 'react-dom';
import GuestManager from './components/GuestManager';

document.addEventListener('DOMContentLoaded', () => {
  const eventGuestsManagerElement = document.getElementById('x-event-guests-manager');

  if (eventGuestsManagerElement) {
    const eventId = eventGuestsManagerElement.getAttribute('data-event-id');
    ReactDOM.render(<GuestManager eventId={eventId} />, eventGuestsManagerElement);
  }
});
