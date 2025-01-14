// client/src/pages/CreateRecipePage.js
import React from "react";
import {
  Container,
  Heading,
  Box,
  useToast,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { RecipeForm } from "../components/recipe/RecipeForm";
import { apiClient } from "../services/api/apiClient";
import { logger } from "../services/logging/logger";

export const CreateRecipePage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (recipeData) => {
    try {
      const response = await apiClient.post("/recipes", recipeData);

      toast({
        title: "Recipe created!",
        description: "Your recipe has been published successfully.",
        status: "success",
        duration: 5000,
      });

      // Redirect to the new recipe page
      navigate(`/recipes/${response.id}`);
    } catch (error) {
      logger.error("Failed to create recipe:", error);
      throw error; // Let the form handle the error display
    }
  };

  return (
    <Container maxW="container.lg" py={8}>
      <Heading mb={6}>Create New Recipe</Heading>

      <Alert status="info" mb={6}>
        <AlertIcon />
        All fields marked with * are required
      </Alert>

      <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
        <RecipeForm onSubmit={handleSubmit} />
      </Box>
    </Container>
  );
};
