import { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
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

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Generate previews
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Add to existing
    setSelectedFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const finalEvent = formData.event === 'Other' ? formData.customEvent : formData.event;

    const formPayload = new FormData();
    formPayload.append('name', formData.name);
    formPayload.append('email', formData.email);
    formPayload.append('mobile', formData.mobile);
    formPayload.append('location', formData.location);
    formPayload.append('event', finalEvent);
    formPayload.append('eventDate', formData.eventDate);
    formPayload.append('theme', formData.theme);
    formPayload.append('budget', formData.budget);
    formPayload.append('eggless', formData.eggless);

    selectedFiles.forEach((file, i) => {
      formPayload.append('images', file); // multer will handle as array
    });

    try {
      const response = await fetch('http://localhost:5005/api/send-cake-request', {
        method: 'POST', 
        body: formPayload,
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
        setSelectedFiles([]);
        setImagePreviews([]);
      } else {
        alert('Failed to send. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="help-form-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2>Let Us Help You Choose Your Cake</h2>
      <form onSubmit={handleSubmit} className="help-form" encType="multipart/form-data">
        <div className="form-group">
          <label>Name*</label>
          <input type="text" name="name" required onChange={handleChange} value={formData.name} />
        </div>

        <div className="form-group">
          <label>Mobile Number*</label>
          <input type="tel" name="mobile" required pattern="[0-9]{10}" onChange={handleChange} value={formData.mobile} />
        </div>

        <div className="form-group">
          <label>Email*</label>
          <input type="email" name="email" required onChange={handleChange} value={formData.email} />
        </div>

        <div className="form-group">
          <label>Location / Area*</label>
          <input type="text" name="location" required onChange={handleChange} value={formData.location} />
        </div>

        <div className="form-group">
          <label>Event*</label>
          <select name="event" required onChange={handleChange} value={formData.event} >
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
              value={formData.customEvent}
              onChange={handleChange}
            ></textarea>
          </div>
        )}

        <div className="form-group">
          <label>Event Date*</label>
          <input type="date" name="eventDate" value={formData.eventDate} min={new Date().toISOString().split("T")[0]} required onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Theme</label>
          <input type="text" name="theme" value={formData.theme} placeholder="e.g., Sky, Floral, Cartoon" onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Budget (₹)</label>
          <select name="budget" onChange={handleChange} value={formData.budget}>
            <option value="">Select Budget Range</option>
            <option>Below ₹1000</option>
            <option>₹1000 - ₹2000</option>
            <option>₹2000 - ₹3000</option>
            <option>Above ₹3000</option>
          </select>
        </div>

        <div className="form-group">
          <label>Egg / Eggless</label>
          <select name="eggless" onChange={handleChange} value={formData.eggless}>
            <option value="">Select</option>
            <option>Egg</option>
            <option>Eggless</option>
          </select>
        </div>

        <div className="form-group">
          <label>Upload Cake Inspiration Images</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="preview-container">
            {imagePreviews.map((img, index) => (
              <div className="preview-box" key={index}>
                <img src={img.url} alt={`preview-${index}`} />
                <span className="remove-btn" onClick={() => handleRemoveImage(index)}>×</span>
              </div>
            ))}
          </div>
        )}
        
        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default ContactUs;
