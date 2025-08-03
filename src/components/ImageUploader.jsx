import { useState } from 'react';
import { 
  showCompactSuccess,
  showCompactError,
  showCompactWarning
} from '../utils/notifications';
import { uploadImage } from '../utils/apiWrapper';

export default function ImageUploader({ images = [], onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file) => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showCompactError('Invalid file type. Please upload JPG, PNG, or WebP images only.');
      return false;
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showCompactError(`File "${file.name}" is too large. Maximum size is 5MB.`);
      return false;
    }

    return true;
  };

  const uploadFile = async (file) => {
    // Validate file before upload
    if (!validateFile(file)) {
      return;
    }
    setIsUploading(true);

    try {
      // Use native Fetch API to POST the file
       const imageUrl = await uploadImage(file);
      
      // Add the uploaded image URL to the images array
      onChange([...images, imageUrl]);
    } catch (error) {
      console.error('Upload error:', error);
      showCompactError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check total number of images
      if (images.length + files.length > 10) {
        showCompactWarning('Maximum 10 images allowed. Some files will be skipped.');
        const allowedFiles = files.slice(0, 10 - images.length);
        allowedFiles.forEach(uploadFile);
      } else {
        files.forEach(uploadFile);
      }
      
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
    showCompactSuccess('Image removed');
  };

  return (
    <div className="image-uploader">
        <div className="upload-section">
            <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileSelect}
                disabled={isUploading}
                multiple
                className="file-input"
            />
            {isUploading && (
                 <div className="upload-progress">
                    <div className="spinner"></div>
                    <span>Uploading image...</span>
                </div>
            )}
            <div className="upload-info">
                <p>📸 Upload images (JPG, PNG, WebP)</p>
                <p>📏 Maximum size: 5MB per image</p>
                <p>📂 Maximum images: 10</p>
            </div>
            {images.length > 0 && (
                <div className="images-grid">
                    {images.map((url, index) => (
                        <div key={index} className="image-preview">
                            <img
                                src={url}
                                alt={`Preview ${index + 1}`}
                                loading="lazy"
                            />
                            <button
                                type="button"
                                className="remove-btn"
                                onClick={() => removeImage(index)}
                                title="Remove image"
                            >
                                ×
                            </button>
                        </div>
                        )
                    )}
                </div>
            )}
        </div>
    </div>
  );
}
