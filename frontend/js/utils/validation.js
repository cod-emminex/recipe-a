// frontend/js/utils/validation.js

export const Validators = {
  required: (value) => {
    return value !== null &&
      value !== undefined &&
      value.toString().trim() !== ""
      ? { valid: true }
      : { valid: false, message: "This field is required" };
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value)
      ? { valid: true }
      : { valid: false, message: "Please enter a valid email address" };
  },

  minLength: (length) => (value) => {
    return value.length >= length
      ? { valid: true }
      : { valid: false, message: `Must be at least ${length} characters long` };
  },

  maxLength: (length) => (value) => {
    return value.length <= length
      ? { valid: true }
      : { valid: false, message: `Must not exceed ${length} characters` };
  },

  password: (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(value)
      ? { valid: true }
      : {
          valid: false,
          message:
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
        };
  },

  matchValue: (matchField) => (value, formData) => {
    return value === formData[matchField]
      ? { valid: true }
      : { valid: false, message: "Values do not match" };
  },

  url: (value) => {
    try {
      new URL(value);
      return { valid: true };
    } catch {
      return { valid: false, message: "Please enter a valid URL" };
    }
  },

  numeric: (value) => {
    return !isNaN(value) && value !== ""
      ? { valid: true }
      : { valid: false, message: "Please enter a valid number" };
  },
};

export class FormValidator {
  constructor(config) {
    this.config = config;
    this.errors = {};
  }

  validate(formData) {
    this.errors = {};

    Object.entries(this.config).forEach(([field, validators]) => {
      const value = formData[field];

      for (const validator of validators) {
        const result = validator(value, formData);
        if (!result.valid) {
          this.errors[field] = result.message;
          break;
        }
      }
    });

    return Object.keys(this.errors).length === 0;
  }

  getError(field) {
    return this.errors[field];
  }
}

// Usage example:
export const createRecipeValidator = new FormValidator({
  title: [Validators.required, Validators.maxLength(100)],
  description: [Validators.required, Validators.maxLength(500)],
  ingredients: [Validators.required],
  instructions: [Validators.required],
  cookingTime: [Validators.required, Validators.numeric],
  servings: [Validators.required, Validators.numeric],
});
