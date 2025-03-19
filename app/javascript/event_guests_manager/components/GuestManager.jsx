import React, { useState, useEffect } from 'react';

const GuestManager = ({ eventId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch(`/events/${eventId}/event_guests`);
      if (response.ok) {
        const data = await response.json();
        setGuests(data);
      }
    } catch (error) {
      console.error('Error fetching guests:', error);
      setErrors({ guestList: "There was a problem loading the guest list. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    let formErrors = {};

    if (name.trim().length === 0) {
      formErrors.name = "Name is required";
    }

    if (email.trim().length === 0) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

      const response = await fetch(`/events/${eventId}/event_guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          name,
          email
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setGuests(prevGuests => [...prevGuests, data.guest]);

        setName('');
        setEmail('');
        setSuccessMessage('Guest added successfully!');
      } else {
        const responseErrors = data.errors || ['Something went wrong'];
        const errorsObj = {};

        responseErrors.forEach(err => {
          if (err.includes('Name')) errorsObj.name = err;
          else if (err.includes('Email')) errorsObj.email = err;
          else errorsObj.general = err;
        });

        setErrors(errorsObj);
      }
    } catch (error) {
      console.error('Error adding guest:', error);
      setErrors({ general: 'Failed to add guest. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="guest-manager">
      <div className="guest-list">
        <h3>Current Guests ({guests.length})</h3>
        {isLoading ? (
          <p>Loading guests...</p>
        ) : errors.guestList ? (
          <div className="alert alert-warning" role="alert">
            {errors.guestList}
            <button
              className="btn btn-link"
              onClick={fetchGuests}
              aria-label="Retry loading guest list"
            >
              Retry
            </button>
          </div>
        ) : guests.length > 0 ? (
          <table className="guest-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {guests.map(guest => (
                <tr key={guest.id}>
                  <td>{guest.name}</td>
                  <td>{guest.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No guests have been added yet.</p>
        )}
      </div>

      <hr />

      <h3>Add Guest</h3>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="alert alert-danger" role="alert">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="guestName">Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            id="guestName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "nameError" : undefined}
          />
          {errors.name && <div id="nameError" className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="guestEmail">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            id="guestEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            aria-required="true"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "emailError" : undefined}
          />
          {errors.email && <div id="emailError" className="invalid-feedback">{errors.email}</div>}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Guest'}
        </button>
      </form>
    </div>
  );
};

export default GuestManager;
