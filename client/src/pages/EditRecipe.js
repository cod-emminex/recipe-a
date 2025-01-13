// client/src/pages/EditRecipe.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Heading, useToast } from "@chakra-ui/react";
import RecipeForm from "../components/RecipeForm";
import LoadingSpinner from "../components/LoadingSpinner";
import { recipeAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const EditRecipe = () => {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      const recipe = response.data;

      // Check if user is the author
      if (recipe.author._id !== user.id) {
        toast({
          title: "Unauthorized",
          description: "You can only edit your own recipes",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/recipes");
        return;
      }

      setRecipe(recipe);
    } catch (error) {
      toast({
        title: "Error fetching recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      navigate("/recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSaving(true);
    try {
      await recipeAPI.update(id, formData);
      toast({
        title: "Recipe updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/recipes/${id}`);
    } catch (error) {
      toast({
        title: "Error updating recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!recipe) return null;

  return (
    <Container maxW="container.md" py={8}>
      <Heading mb={6}>Edit Recipe</Heading>
      <RecipeForm
        initialData={recipe}
        onSubmit={handleSubmit}
        isLoading={isSaving}
      />
    </Container>
  );
};

export default EditRecipe;
