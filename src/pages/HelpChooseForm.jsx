import React, { useState } from 'react';
import './HelpChooseForm.css';

const HelpChooseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    location: '',
    event: '',
    theme: '',
    budget: '',
    eggless: '',
    eventDate: '',
    customEvent: ''
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5005/api/send-cake-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Cake request sent successfully!');
        setFormData({
          name: '',
          mobile: '',
          email: '',
          location: '',
          event: '',
          theme: '',
          budget: '',
          eggless: '',
          eventDate: '',
          customEvent: ''
        });
      } else {
        alert('Failed to send. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    }
  };


  return (
    <div className="help-form-container">
      <h2>Let Us Help You Choose Your Cake</h2>
      <form onSubmit={handleSubmit} className="help-form">
        <div className="form-group">
          <label>Name*</label>
          <input type="text" name="name" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Mobile Number*</label>
          <input type="tel" name="mobile" required pattern="[0-9]{10}" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input type="email" name="email" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Location / Area*</label>
          <input type="text" name="location" required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Event*</label>
          <select name="event" required onChange={handleChange}>
            <option value="">Select Event</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Wedding</option>
            <option>Baby Shower</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.event === 'Other' && (
          <div className="form-group">
            <label>Please specify the Event</label>
            <textarea
              name="customEvent"
              placeholder="Describe your event..."
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>
        )}

        <div className="form-group">
          <label>Event Date*</label>
          <input type="date" name="eventDate" min={new Date().toISOString().split("T")[0]} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Theme</label>
          <input type="text" name="theme" placeholder="e.g., Sky, Floral, Cartoon" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Budget (₹)</label>
          <select name="budget" onChange={handleChange}>
            <option value="">Select Budget Range</option>
            <option>Below ₹1000</option>
            <option>₹1000 - ₹2000</option>
            <option>₹2000 - ₹3000</option>
            <option>Above ₹3000</option>
          </select>
        </div>

        <div className="form-group">
          <label>Egg / Eggless</label>
          <select name="eggless" onChange={handleChange}>
            <option value="">Select</option>
            <option>Egg</option>
            <option>Eggless</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default HelpChooseForm;
