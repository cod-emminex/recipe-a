// client/src/components/RecipeRating.js
import { useState } from "react";
import { HStack, Icon, Text, useToast } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";

const RecipeRating = ({ recipeId, initialRating, totalRatings }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const handleRate = async (value) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to rate recipes",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await recipeAPI.rateRecipe(recipeId, value);
      setRating(response.data.averageRating);
      toast({
        title: "Rating submitted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error submitting rating",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HStack spacing={2}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          as={StarIcon}
          color={star <= (hoveredRating || rating) ? "yellow.400" : "gray.200"}
          cursor={user ? "pointer" : "default"}
          onClick={() => !isLoading && handleRate(star)}
          onMouseEnter={() => user && setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
        />
      ))}
      <Text fontSize="sm" color="gray.500">
        ({totalRatings} {totalRatings === 1 ? "rating" : "ratings"})
      </Text>
    </HStack>
  );
};

export default RecipeRating;
