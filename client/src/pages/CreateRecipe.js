// client/src/pages/CreateRecipe.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast, Container, Heading } from "@chakra-ui/react";
import RecipeForm from "../components/RecipeForm";
import { recipeAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const CreateRecipe = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { user, checkAuth } = useAuth();

  const handleSubmit = async (formData) => {
    if (!user) {
      await checkAuth(); // Verify auth status
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to create a recipe",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/login");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await recipeAPI.create({
        ...formData,
        author: user.id, // Make sure to include the author
      });

      toast({
        title: "Recipe created successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/recipe/${response.data.recipeNumber}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error creating recipe";

      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });

      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingSpinner />;

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6} fontFamily="Montserrat">
        Create New Recipe
      </Heading>
      <RecipeForm onSubmit={handleSubmit} Loading={loading} />
    </Container>
  );
};

export default CreateRecipe;
