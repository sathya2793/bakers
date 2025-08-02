// utils/apiWrapper.js
import { showCompactSuccess, showCompactError, showCompactWarning } from './notifications';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5005';

const getAuthHeaders = () => {
  const token = localStorage.getItem('googleToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

const handleAPIError = (error, response) => {
  // Check for JWT expiration
  const errorMessage = error?.message || error?.details || '';
  
  if (errorMessage.toLowerCase().includes('jwt expired') || 
      errorMessage.toLowerCase().includes('token expired') ||
      response?.status === 401) {
    showCompactError('Your session has expired. Please log in again.');
    localStorage.removeItem('googleToken');
    window.location.href = '/login';
    return true;
  }
  
  return false;
};

export const makeAPICall = async (endpoint, options = {}) => {
  try {
    const config = {
      method: 'GET',
      headers: getAuthHeaders(),
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle JWT expiration
      if (handleAPIError(data, response)) {
        throw new Error('JWT_EXPIRED');
      }
      // Handle specific error types
      switch (data.error) {
        case 'DUPLICATE_TITLE':
          showCompactError(`⚠️ "${data.details?.field === 'title' ? 'This title' : 'This item'}" already exists. Please choose a different title.`);
          const titleInput = document.querySelector('input[name="title"]');
          if (titleInput) {
            titleInput.focus();
            titleInput.select();
          }
          break;
        
        case 'VALIDATION_ERROR':
          const validationMessages = data.details?.errors?.join(', ') || 'Validation failed';
          showCompactError(`Validation Error: ${validationMessages}`);
          break;
        
        case 'PRODUCT_NOT_FOUND':
          showCompactError('Product not found. It may have been deleted.');
          break;
        
        case 'FILE_TOO_LARGE':
          showCompactError('File too large. Please choose a smaller image (max 5MB).');
          break;
        
        case 'INVALID_FILE_TYPE':
          showCompactError('Invalid file type. Please upload JPG, PNG, or WebP images only.');
          break;
        
        case 'MISSING_FIELDS':
          const missingFields = data.details?.missingFields?.join(', ') || 'required fields';
          showCompactError(`Please fill in: ${missingFields}`);
          break;
        
        default:
          showCompactError(data.message || 'An error occurred');
      }

      throw new Error(data.error || 'API_ERROR');
    }

    return data;
  } catch (error) {
    if (error.message === 'JWT_EXPIRED') {
      throw error; // Already handled
    }
    
    // Network or other errors
    if (!navigator.onLine) {
      showCompactError('No internet connection. Please check your network.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showCompactError('Unable to connect to server. Please try again.');
    }
    
    throw error;
  }
};

// Specific API functions
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      switch (data.error) {
        case 'FILE_TOO_LARGE':
          showCompactError('Image too large. Please choose a smaller file (max 5MB).');
          break;
        case 'INVALID_FILE_TYPE':
          showCompactError('Invalid file type. Please upload JPG, PNG, or WebP images.');
          break;
        case 'NO_FILE':
          showCompactError('Please select an image to upload.');
          break;
        default:
          showCompactError(data.message || 'Failed to upload image');
      }
      throw new Error(data.error || 'UPLOAD_ERROR');
    }

    showCompactSuccess('Image uploaded successfully!');
    return data.data.url;
  } catch (error) {
    if (error.message !== 'UPLOAD_ERROR') {
      showCompactError('Network error during upload. Please try again.');
    }
    throw error;
  }
};

export const submitCakeRequest = async (formData) => {
  try {
    const data = await makeAPICall('/api/send-cake-request', {
      method: 'POST',
      body: formData, // FormData object
      headers: {}, // Let browser set content-type for FormData
    });
    showCompactSuccess('🎉 Your cake request has been submitted successfully! We\'ll contact you soon.');
    return data;
  } catch (error) {
    if (error.message !== 'API_ERROR') {
      showCompactError('Failed to submit cake request. Please try again.');
    }
    throw error;
  }
};

export const getCustomCardImageAPICall = async (endpoint, options = {}) => {
  try {
    const config = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      showCompactError(data.message || 'An error occurred');
      throw new Error(data.error || 'API_ERROR');
    }

    return data;
  } catch (error) {
    if (!navigator.onLine) {
      showCompactError('No internet connection. Please check your network.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showCompactError('Unable to connect to server. Please try again.');
    }
    
    throw error;
  }
};

// Updated apiWrapper functions
// Updated apiWrapper functions for single JSON storage
export const fetchQuickSuggestions = async () => {
  try {
    const data = await makeAPICall('/api/quick-suggestions');
    return data.data || {};
  } catch (error) {
    if (error.message !== 'JWT_EXPIRED' && error.message !== 'API_ERROR') {
      showCompactError('Failed to fetch quick suggestions. Please try again.');
    }
    return {};
  }
};

export const saveAllQuickSuggestions = async (suggestions) => {
  try {
    const data = await makeAPICall('/api/quick-suggestions', {
      method: 'POST',
      body: JSON.stringify({ suggestions }),
    });
    showCompactSuccess('All suggestions saved successfully!');
    return data.data;
  } catch (error) {
    if (error.message !== 'JWT_EXPIRED' && error.message !== 'API_ERROR') {
      showCompactError('Failed to save quick suggestions. Please try again.');
    }
    throw error;
  }
};

export const updateQuickSuggestions = async (suggestions) => {
  try {
    const data = await makeAPICall('/api/quick-suggestions', {
      method: 'PUT',
      body: JSON.stringify({ suggestions }),
    });
    showCompactSuccess('Suggestions updated successfully!');
    return data.data;
  } catch (error) {
    if (error.message !== 'JWT_EXPIRED' && error.message !== 'API_ERROR') {
      showCompactError('Failed to update suggestions. Please try again.');
    }
    throw error;
  }
};

export const clearAllQuickSuggestions = async () => {
  try {
    const data = await makeAPICall('/api/quick-suggestions', {
      method: 'DELETE',
    });
    showCompactSuccess('All suggestions cleared successfully!');
    return data.data;
  } catch (error) {
    if (error.message !== 'JWT_EXPIRED' && error.message !== 'API_ERROR') {
      showCompactError('Failed to clear suggestions. Please try again.');
    }
    throw error;
  }
};

