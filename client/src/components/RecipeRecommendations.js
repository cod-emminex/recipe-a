// client/src/components/RecipeRecommendations.js
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  useToast,
  Skeleton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { recipeAPI } from "../services/api";
import RecipeCard from "./RecipeCard";

const RecipeRecommendations = ({ userId, currentRecipeId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, [userId, currentRecipeId]);

  const fetchRecommendations = async () => {
    try {
      const response = await recipeAPI.getRecommendations({
        userId,
        currentRecipeId,
        limit: 6,
      });
      setRecommendations(response.data);
    } catch (error) {
      toast({
        title: "Error fetching recommendations",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <Heading size="md" mb={4}>
          Recommended Recipes
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height="200px" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>
        Recommended Recipes
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {recommendations.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} showAuthor compact />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default RecipeRecommendations;
