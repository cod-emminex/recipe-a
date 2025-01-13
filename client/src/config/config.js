// client/src/config/config.js
const config = {
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:3000/api",
  WS_URL: process.env.REACT_APP_WS_URL || "ws://localhost:3000",
  IMAGE_UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  RECIPE_PAGE_SIZE: 12,
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  DEFAULT_AVATAR: "/images/default-avatar.png",
  DEFAULT_RECIPE_IMAGE: "/images/default-recipe.jpg",
  APP_VERSION: "1.0.0",
  DEBOUNCE_DELAY: 300,
};

export default config;
