// src/utils/validators.js
// Client-side validation functions

export const validators = {
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return null;
  },

  minLength: (value, min, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return null;
  },

  maxLength: (value, max, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length > max) {
      return `${fieldName} cannot exceed ${max} characters`;
    }
    return null;
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return null;
  },

  confirmPassword: (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return null;
  },

  positiveNumber: (value, fieldName = 'This field') => {
    if (value === '' || value === null || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  }
};

// Validation schema builder
export const createValidator = (rules) => {
  return (values) => {
    const errors = {};

    Object.keys(rules).forEach(field => {
      const fieldRules = rules[field];
      
      for (const rule of fieldRules) {
        const error = rule(values[field], values);
        if (error) {
          errors[field] = error;
          break; // Stop at first error for each field
        }
      }
    });

    return errors;
  };
};

// Pre-built validators for common forms
export const loginValidator = createValidator({
  email: [validators.email],
  password: [(v) => validators.required(v, 'Password')]
});

export const registerValidator = createValidator({
  name: [
    (v) => validators.required(v, 'Name'),
    (v) => validators.minLength(v, 2, 'Name')
  ],
  email: [validators.email],
  password: [validators.password],
  confirmPassword: [(v, values) => validators.confirmPassword(v, values.password)]
});

export const shippingValidator = createValidator({
  fullName: [(v) => validators.required(v, 'Full name')],
  address: [(v) => validators.required(v, 'Address')],
  city: [(v) => validators.required(v, 'City')],
  postalCode: [(v) => validators.required(v, 'Postal code')],
  country: [(v) => validators.required(v, 'Country')]
});

export default validators;
