// src/hooks/useCloudinaryUpload.js
import { useState, useCallback } from 'react';

// Get config from environment variables (secure)
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Custom hook for Cloudinary image uploads
 * @returns {Object} { uploadImage, uploading, progress, error }
 */
const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadImage = useCallback(async (file) => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return null;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return null;
    }

    // Check config
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError('Cloudinary not configured. Check .env file.');
      return null;
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'hoodies');

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            setProgress(percent);
          }
        });

        xhr.addEventListener('load', () => {
          setUploading(false);
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            setProgress(100);
            resolve(response.secure_url);
          } else {
            let errorMsg = 'Upload failed';
            try {
              const errResponse = JSON.parse(xhr.responseText);
              errorMsg = errResponse.error?.message || errorMsg;
            } catch (e) {}
            setError(errorMsg);
            reject(new Error(errorMsg));
          }
        });

        xhr.addEventListener('error', () => {
          const errorMsg = 'Network error during upload';
          setError(errorMsg);
          setUploading(false);
          reject(new Error(errorMsg));
        });

        xhr.open('POST', UPLOAD_URL);
        xhr.send(formData);
      });
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return null;
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploadImage,
    uploading,
    progress,
    error,
    resetUpload
  };
};

export default useCloudinaryUpload;
