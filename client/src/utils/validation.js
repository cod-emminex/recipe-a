// client/src/utils/validation.js
export const validateForm = (values, type) => {
  const errors = {};

  if (type === "register" || type === "login") {
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (type === "register" && values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    if (type === "register") {
      if (!values.username) {
        errors.username = "Username is required";
      }
    }
  }

  if (type === "recipe") {
    if (!values.title) {
      errors.title = "Title is required";
    }

    if (!values.description) {
      errors.description = "Description is required";
    }

    if (!values.ingredients || values.ingredients.length === 0) {
      errors.ingredients = "At least one ingredient is required";
    }

    if (!values.steps || values.steps.length === 0) {
      errors.steps = "At least one step is required";
    }
  }

  return errors;
};
