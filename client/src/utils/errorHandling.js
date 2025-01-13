// client/src/utils/errorHandling.js
import { toast } from "@chakra-ui/react";

export class ApiError extends Error {
  constructor(message, statusCode, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "ApiError";
  }
}

export const handleApiError = (error, customMessage = null) => {
  console.error("API Error:", error);

  let errorMessage = customMessage || "An unexpected error occurred";

  if (error.response) {
    // Server responded with error
    errorMessage = error.response.data?.error || errorMessage;
  } else if (error.request) {
    // Request made but no response
    errorMessage = "Unable to connect to server";
  }

  toast({
    title: "Error",
    description: errorMessage,
    status: "error",
    duration: 5000,
    isClosable: true,
  });

  return errorMessage;
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isValidationError = (error) => {
  return error.response?.status === 422;
};
