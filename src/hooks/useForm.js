// src/hooks/useForm.js
import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {object} initialValues - Initial form values
 * @param {function} validate - Validation function (optional)
 * @param {function} onSubmit - Submit handler function
 */
const useForm = (initialValues = {}, validate = null, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle blur (for touched state)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate on blur if validate function exists
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: validationErrors[name]
        }));
      }
    }
  }, [values, validate]);

  // Set a specific field value
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Set a specific field error
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    // Run validation
    if (validate) {
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        // Mark all fields as touched
        const allTouched = {};
        Object.keys(values).forEach(key => {
          allTouched[key] = true;
        });
        setTouched(allTouched);
        return;
      }
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (err) {
      // Handle server validation errors
      if (err.errors) {
        const serverErrors = {};
        err.errors.forEach(error => {
          serverErrors[error.field] = error.message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: err.message });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, onSubmit]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldError,
    resetForm,
    setValues,
    setErrors
  };
};

export default useForm;
