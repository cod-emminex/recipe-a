// client/src/utils/imageHandling.js
import config from "../config/config";

export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (!config.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Unsupported file type. Please use JPEG, PNG, or WebP images",
    };
  }

  if (file.size > config.IMAGE_UPLOAD_MAX_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${
        config.IMAGE_UPLOAD_MAX_SIZE / (1024 * 1024)
      }MB`,
    };
  }

  return { isValid: true };
};

export const resizeImage = async (file, maxWidth = 1200, maxHeight = 1200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(new File([blob], file.name, { type: file.type }));
          },
          file.type,
          0.9
        );
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateThumbnail = async (file, size = 200) => {
  return resizeImage(file, size, size);
};
