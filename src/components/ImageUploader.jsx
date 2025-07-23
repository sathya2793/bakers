import { useState } from 'react';

export default function ImageUploader({ images, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);

    try {
      // Use native Fetch API to POST the file
      const response = await fetch('http://localhost:5005/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Your backend should return JSON with the image URL, e.g., { url: "..." }
      const data = await response.json();
      onChange([...images, data.url]);

    } catch (error) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="image-uploader">
      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => {
          if (e.target.files) {
            Array.from(e.target.files).forEach(uploadFile);
          }
        }}
        disabled={isUploading}
        multiple
      />
      {isUploading && (
        <div>Uploading... {uploadProgress}%</div>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
        {images.map((url, index) => (
          <div key={index} style={{ position: 'relative', width: '120px', height: '120px' }}>
            <img
              src={url}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
            />
            <button
              type="button"
              style={{ position: 'absolute', top: '2px', right: '4px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' ,display: 'flex', justifyContent: 'center',alignItems: 'center'}}
              onClick={() => onChange(images.filter((_, i) => i !== index))}>
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
