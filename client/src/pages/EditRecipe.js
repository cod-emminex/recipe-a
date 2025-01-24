// client/src/pages/EditRecipe.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, useToast } from "@chakra-ui/react";
import { recipeAPI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import RecipeForm from "../components/RecipeForm";
import PageTitle from "../components/PageTitle";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeAPI.getById(id);
        const recipe = response.data;

        // Transform the data to match the form structure
        setInitialData({
          ...recipe, // Keep all original data
          category: recipe.category || "",
          image: recipe.image || "",
          cookingTime: recipe.cookingTime || "",
          country: recipe.country || "",
          servings: recipe.servings || "",
          difficulty: recipe.difficulty || "medium",
        });
      } catch (error) {
        toast({
          title: "Error fetching recipe",
          description: error.message || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        navigate("/recipes");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, toast, navigate]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      // Clean the data before updating
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: formData.ingredients.filter((item) => item.trim()),
        steps: formData.steps.filter((item) => item.trim()),
        author: initialData.author, // Preserve the author information
      };

      await recipeAPI.update(id, cleanedData);

      toast({
        title: "Recipe updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(`/recipe/${id}`);
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error updating recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!initialData) return null;

  return (
    <Container maxW="container.md" py={8}>
      <PageTitle title="Edit Recipe" />
      <RecipeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        isLoading={submitting}
      />
    </Container>
  );
};

export default EditRecipe;
