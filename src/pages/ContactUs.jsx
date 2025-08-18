import { useState } from "react";
import { submitCakeRequest } from "../utils/apiWrapper";
import {
  showCompactSuccess,
  showCompactError,
  showCompactWarning,
} from "../utils/notifications";
import "./ContactUs.css";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    location: "",
    pincode: "",
    event: "",
    theme: "",
    budget: "",
    eggless: "",
    eventDate: "",
    customEvent: "",
    finalDescription: "",
  });
  const [cart, setCart] = useState(() => {
    try {
      const stored = window.localStorage.getItem("cake_cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageDescriptions, setImageDescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editIdx, setEditIdx] = useState(null);
  const [editComment, setEditComment] = useState("");

  const validateFile = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showCompactError(
        `"${file.name}" is not a valid image file. Please upload JPG, PNG, or WebP images.`
      );
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showCompactError(
        `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(
          1
        )}MB). Maximum size is 5MB.`
      );
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (imagePreviews.length + files.length > 10) {
      showCompactWarning(
        "Maximum 10 images allowed. Some files will be ignored."
      );
    }

    const validFiles = files.filter(validateFile);
    const filesToAdd = validFiles.slice(0, 10 - imagePreviews.length);

    // if (filesToAdd.length < files.length) {
    //   showCompactWarning(`Only ${filesToAdd} images were added due to limits.`);
    // }

    const newPreviews = filesToAdd.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    // Add empty descriptions for new images
    const newDescriptions = new Array(filesToAdd.length).fill("");

    setSelectedFiles((prev) => [...prev, ...filesToAdd]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setImageDescriptions((prev) => [...prev, ...newDescriptions]);

    if (filesToAdd.length > 0) {
      showCompactSuccess(`${filesToAdd.length} image(s) added successfully`);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index].url);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedDescriptions = imageDescriptions.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    setImageDescriptions(updatedDescriptions);
    showCompactSuccess("Image removed");
  };

  const handleImageDescriptionChange = (index, description) => {
    const updatedDescriptions = [...imageDescriptions];
    updatedDescriptions[index] = description;
    setImageDescriptions(updatedDescriptions);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("Name is required");
    if (!formData.mobile.trim()) errors.push("Mobile number is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.location.trim()) errors.push("Location is required");
    if (!formData.event.trim()) errors.push("Event is required");
    if (!formData.eventDate.trim()) errors.push("Event date is required");

    // Indian mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      errors.push(
        "Please enter a valid Indian mobile number (10 digits starting with 6-9)"
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (formData.eventDate) {
      const selectedDate = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push("Event date cannot be in the past");
      }
    }

    if (formData.event === "Other" && !formData.customEvent.trim()) {
      errors.push("Please specify the custom event");
    }

    return errors;
  };

  const handleEditClick = (idx, currentComment) => {
    setEditIdx(idx);
    setEditComment(currentComment || "");
  };

  const handleEditCancel = () => {
    setEditIdx(null);
    setEditComment("");
  };

  const handleEditSave = (idx, id) => {
    setCart((prev) => {
      const updatedCart = prev.map((item, cartIdx) =>
        cartIdx === idx ? { ...item, comment: editComment } : item
      );
      window.localStorage.setItem("cake_cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    setEditIdx(null);
    setEditComment("");
    showCompactSuccess("Comment updated");
  };

  // Handle Cart Row Delete
  const handleCartDelete = (id) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);
      window.localStorage.setItem("cake_cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    showCompactSuccess("Selected Cake removed from selection");
  };

  // On form submit, also clear cart block after submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      showCompactError(
        `Please fix the following: ${validationErrors.join(", ")}`
      );
      return;
    }

    setLoading(true);

    const finalEvent =
      formData.event === "Other" ? formData.customEvent : formData.event;

    const formPayload = new FormData();
    formPayload.append("name", formData.name.trim());
    formPayload.append("email", formData.email.trim());
    formPayload.append("mobile", formData.mobile.trim());
    formPayload.append("location", formData.location.trim());
    formPayload.append("pincode", formData.pincode.trim());
    formPayload.append("event", finalEvent);
    formPayload.append("eventDate", formData.eventDate);
    formPayload.append("theme", formData.theme.trim());
    formPayload.append("budget", formData.budget);
    formPayload.append("eggless", formData.eggless);
    formPayload.append("finalDescription", formData.finalDescription.trim());
    if (cart) {
      console.log("🚀 ~ handleSubmit ~ cart:", cart);
      formPayload.append("cart", JSON.stringify(cart));
    }
    formPayload.append("imageDescriptions", JSON.stringify(imageDescriptions));
    selectedFiles.forEach((file) => {
      formPayload.append("images", file);
    });

    try {
      await submitCakeRequest(formPayload);
      setFormData({
        name: "",
        mobile: "",
        email: "",
        location: "",
        pincode: "",
        event: "",
        theme: "",
        budget: "",
        eggless: "",
        eventDate: "",
        customEvent: "",
        finalDescription: "",
      });
      setCart([]);
      window.localStorage.removeItem("cake_cart");
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
      setSelectedFiles([]);
      setImagePreviews([]);
      setImageDescriptions([]);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Cleanup on component unmount
  useState(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.url.startsWith("blob:")) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, []);

  return (
    <div className="contact-container">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Submitting your custom cake request...</p>
        </div>
      )}

      <div className="contact-header">
        <div className="header-icon">🎂</div>
        <h1>Custom Cake Design Request</h1>
        <p>
          Share your dream cake ideas with us! Upload inspiration images and
          describe your vision.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="contact-form"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
      >
        {/* Personal Information */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">👤</span>
            Personal Information
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleChange}
                value={formData.name}
                placeholder="Enter your full name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label>
                Mobile Number *{" "}
                <span className="helper-text">(Indian numbers only)</span>
              </label>
              <div className="mobile-input">
                <span className="country-code">+91</span>
                <input
                  type="number"
                  name="mobile"
                  required
                  pattern="[6-9][0-9]{9}"
                  onChange={handleChange}
                  value={formData.mobile}
                  placeholder="9876543210"
                  maxLength="10"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                value={formData.email}
                placeholder="your.email@example.com"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label>Location / Area *</label>
              <input
                type="text"
                name="location"
                required
                onChange={handleChange}
                value={formData.location}
                placeholder="Your city or area"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="number"
                name="pincode"
                required
                onChange={handleChange}
                value={formData.pincode}
                placeholder="Your pincode"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">🎉</span>
            Event Details
          </h3>

          <div className="form-row">
            <div className="form-group">
              <label>Event Type *</label>
              <select
                name="event"
                required
                onChange={handleChange}
                value={formData.event}
              >
                <option value="">Select Event</option>
                <option value="Birthday">Birthday</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Wedding">Wedding</option>
                <option value="Baby Shower">Baby Shower</option>
                <option value="Engagement">Engagement</option>
                <option value="Graduation">Graduation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Event Date *</label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate}
                min={new Date().toISOString().split("T")[0]}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {formData.event === "Other" && (
            <div className="form-group">
              <label>Please specify the Event *</label>
              <textarea
                name="customEvent"
                placeholder="Describe your special event..."
                rows="3"
                value={formData.customEvent}
                onChange={handleChange}
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>Theme / Style</label>
              <input
                type="text"
                name="theme"
                value={formData.theme}
                placeholder="e.g., Floral, Cartoon, Elegant, Rustic"
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <div className="form-group">
              <label>Preference</label>
              <select
                name="eggless"
                onChange={handleChange}
                value={formData.eggless}
              >
                <option value="">Select Preference</option>
                <option value="Egg">With Egg</option>
                <option value="Eggless">Eggless</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Budget Range (₹)</label>
            <select
              name="budget"
              onChange={handleChange}
              value={formData.budget}
            >
              <option value="">Select Budget Range</option>
              <option value="Below ₹1000">Below ₹1,000</option>
              <option value="₹1000 - ₹2500">₹1,000 - ₹2,500</option>
              <option value="₹2500 - ₹5000">₹2,500 - ₹5,000</option>
              <option value="₹5000 - ₹10000">₹5,000 - ₹10,000</option>
              <option value="Above ₹10000">Above ₹10,000</option>
            </select>
          </div>
        </div>

        {/* Cart Block styled as form-section */}
        {cart.length > 0 && (
          <div className="form-section cart-block">
            <h3
              className="section-title"
              style={{ textAlign: "left", marginBottom: 20 }}
            >
              <span className="section-icon">🛒</span>
              Your Selected Cakes
            </h3>
            <div className="cart-table-wrapper">
              <div className="cart-grid-table">
                <div className="cart-grid-row cart-grid-header">
                  <div className="grid-cell sn">S.No</div>
                  <div className="grid-cell name">Name</div>
                  <div className="grid-cell comment">Comment</div>
                  <div className="grid-cell action">Action</div>
                </div>
                {cart.map((item, idx) => (
                  <div className="cart-grid-row" key={item.id}>
                    <div className="grid-cell sn">{idx + 1}</div>
                    <div className="grid-cell name">{item.title}</div>
                    <div className="grid-cell comment">
                      {editIdx === idx ? (
                        <textarea
                          rows={2}
                          style={{
                            width: "98%",
                            minHeight: 30,
                            fontSize: "1rem",
                            borderRadius: 5,
                            border: "1px solid #faad59",
                            padding: 6,
                            background: "#fff8e7",
                            color: "#8B4513",
                          }}
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          autoFocus
                        />
                      ) : (
                        item.comment || (
                          <span style={{ color: "#acacac" }}>--</span>
                        )
                      )}
                    </div>
                    <div className="grid-cell action">
                      {editIdx === idx ? (
                        <>
                          <button
                            type="button"
                            className="cake-table-action save"
                            style={{
                              background: "#faad59",
                              color: "#fff",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 4,
                              marginRight: 7,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditSave(idx, item.id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="cake-table-action cancel"
                            style={{
                              background: "#ececec",
                              color: "#8B4513",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 4,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={handleEditCancel}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="cake-table-action edit"
                            style={{
                              background: "#f6dbd2",
                              color: "#8B4513",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 4,
                              marginRight: 7,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() => handleEditClick(idx, item.comment)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="cake-table-action remove"
                            style={{
                              background: "#fdecec",
                              color: "#e45444",
                              border: "none",
                              padding: "5px 12px",
                              borderRadius: 4,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                            onClick={() => handleCartDelete(item.id)}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <hr style={{ margin: "14px 0" }} />
          </div>
        )}

        {/* Cake Inspiration Images */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">📸</span>
            Cake Inspiration Images
          </h3>
          <p className="section-description">
            Upload images of cakes that inspire you. For each image, describe
            what specific elements you like about it.
          </p>

          <div className="file-upload-area">
            <input
              type="file"
              name="images"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="file-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="file-upload-label">
              <div className="upload-icon">📁</div>
              <div className="upload-text">
                <span>Click to upload images</span>
              </div>
            </label>
            <div className="file-info">
              <small>
                📸 Upload up to 10 images • JPG, PNG, WebP • Max 5MB each
              </small>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div className="images-section">
              <h4>Your Inspiration Images ({imagePreviews.length}/10)</h4>
              <div className="images-grid">
                {imagePreviews.map((img, index) => (
                  <div className="image-card" key={index}>
                    <div className="image-preview">
                      <img src={img.url} alt={`Inspiration ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => handleRemoveImage(index)}
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                    <div className="image-description">
                      <label>What do you like about this image?</label>
                      <textarea
                        placeholder="Describe specific elements you want: colors, decorations, shape, style, etc."
                        value={imageDescriptions[index] || ""}
                        onChange={(e) =>
                          handleImageDescriptionChange(index, e.target.value)
                        }
                        rows="3"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Final Vision */}
        <div className="form-section">
          <h3 className="section-title">
            <span className="section-icon">✨</span>
            Your Final Vision
          </h3>
          <div className="form-group">
            <label>Describe Your Dream Cake</label>
            <textarea
              name="finalDescription"
              placeholder="Combine all your ideas here! Describe how you want your final cake to look, including size, colors, decorations, flavors, and any special requirements..."
              rows="5"
              value={formData.finalDescription}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                }
              }}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Submitting Request...
            </>
          ) : (
            <>
              <span className="btn-text">🎂 Submit Custom Cake Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
