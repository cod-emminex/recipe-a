// client/src/utils/validation.js
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  return {
    isValid: password.length >= 8,
    message: "Password must be at least 8 characters long",
  };
};

const validateRecipeForm = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!data.description?.trim()) {
    errors.description = "Description is required";
  }

  if (!data.ingredients?.length || !data.ingredients.some((i) => i.trim())) {
    errors.ingredients = "At least one ingredient is required";
  }

  if (!data.steps?.length || !data.steps.some((s) => s.trim())) {
    errors.steps = "At least one step is required";
  }

  if (data.cookingTime && (isNaN(data.cookingTime) || data.cookingTime < 0)) {
    errors.cookingTime = "Cooking time must be a positive number";
  }

  if (data.servings && (isNaN(data.servings) || data.servings < 1)) {
    errors.servings = "Servings must be at least 1";
  }

  return errors;
};

export const validate = {
  email: validateEmail,
  password: validatePassword,
  recipeForm: validateRecipeForm,
};
