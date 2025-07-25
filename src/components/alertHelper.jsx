import Swal from 'sweetalert2';

// Success notification helper
export const showSuccess = (message, title = 'Success!') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'success',
    toast: true,
    position: 'top-center',
    timer: 2500,
    showConfirmButton: false,
    background: '#f8f9fa',
    color: '#333',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

// Error notification helper
export const showError = (message, title = 'Error!') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#667eea',
    background: '#f8f9fa',
    color: '#333',
    customClass: {
      popup: 'error-popup',
      confirmButton: 'custom-confirm-btn'
    }
  });
};

// Warning notification helper
export const showWarning = (message, title = 'Warning!') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'warning',
    toast: true,
    position: 'top-center',
    timer: 2500,
    showConfirmButton: false,
    background: '#f8f9fa',
    color: '#333',
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

// Info notification helper
export const showInfo = (message, title = 'Info') => {
  return Swal.fire({
    title,
    text: message,
    icon: 'info',
    toast: true,
    position: 'top-center',
    timer: 3000,
    showConfirmButton: false,
    background: '#f8f9fa',
    color: '#333',
    timerProgressBar: true
  });
};

// Delete confirmation helper
export const showDeleteConfirmation = async (itemName, itemType = 'item') => {
  return await Swal.fire({
    title: `Delete ${itemType}?`,
    text: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f44336',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes, Delete!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    backdrop: true,
    allowOutsideClick: false,
    customClass: {
      popup: 'delete-confirmation-popup',
      confirmButton: 'delete-confirm-btn',
      cancelButton: 'delete-cancel-btn'
    }
  });
};

// Loading notification helper
export const showLoading = (message = 'Loading...') => {
  return Swal.fire({
    title: message,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close loading notification
export const closeLoading = () => {
  Swal.close();
};

// Custom confirmation helper
export const showConfirmation = async (message, title = 'Confirm Action') => {
  return await Swal.fire({
    title,
    text: message,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#667eea',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: true
  });
};
