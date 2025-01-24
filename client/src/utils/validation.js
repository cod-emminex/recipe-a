// client/src/utils/validation.js
export const validateForm = (data, type = "login") => {
  const errors = {};

  if (type === "login") {
    // Identifier validation (email or username)
    if (!data.identifier) {
      errors.identifier = "Email or username is required";
    } else if (data.identifier.includes("@")) {
      // If identifier contains @, validate as email
      if (!/\S+@\S+\.\S+/.test(data.identifier)) {
        errors.identifier = "Invalid email format";
      }
    } else {
      // If identifier doesn't contain @, validate as username
      if (data.identifier.length < 3) {
        errors.identifier = "Username must be at least 3 characters";
      }
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    }
  } else if (type === "register") {
    // Username validation
    if (!data.username) {
      errors.username = "Username is required";
    } else if (data.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    // Email validation
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    // Password validation
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // Confirm password
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Optional profile field validations
    if (data.bio && data.bio.length > 500) {
      errors.bio = "Bio must be less than 500 characters";
    }

    if (data.name && data.name.length > 100) {
      errors.name = "Name must be less than 100 characters";
    }

    // You can add more profile field validations here if needed
    if (data.bestRecipe && data.bestRecipe.length > 100) {
      errors.bestRecipe = "Best recipe name must be less than 100 characters";
    }

    if (data.favoriteCuisine && data.favoriteCuisine.length > 50) {
      errors.favoriteCuisine =
        "Favorite cuisine must be less than 50 characters";
    }
  }

  return errors;
};
