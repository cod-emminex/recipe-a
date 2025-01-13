// client/src/pages/CreateRecipe.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Heading, useToast } from "@chakra-ui/react";
import RecipeForm from "../components/RecipeForm";
import { recipeAPI } from "../services/api";

const CreateRecipe = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const response = await recipeAPI.create(formData);
      toast({
        title: "Recipe created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/recipes/${response.data._id}`);
    } catch (error) {
      toast({
        title: "Error creating recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Create New Recipe</Heading>
      <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
    </Container>
  );
};

export default CreateRecipe;
