// client/src/components/RecipeCard.js
import { Box, Heading, Text, Button, Stack, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";

const RecipeCard = ({ recipe, onDelete }) => {
  const { user } = useAuth();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await recipeAPI.delete(recipe._id);
      toast({
        title: "Recipe deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onDelete(recipe._id);
    } catch (error) {
      toast({
        title: "Error deleting recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="lg"
      bg="white"
      transition="all 0.2s"
      _hover={{ shadow: "lg" }}
    >
      <Heading size="md" mb={2}>
        {recipe.title}
      </Heading>
      <Text noOfLines={2} mb={4} color="gray.600">
        {recipe.description}
      </Text>
      <Text fontSize="sm" color="gray.500" mb={4}>
        By {recipe.author.username}
      </Text>

      <Stack direction="row" spacing={4}>
        <Button
          as={RouterLink}
          to={`/recipe/${recipe._id}`}
          colorScheme="teal"
          variant="outline"
          size="sm"
        >
          View Details
        </Button>

        {user && user.id === recipe.author._id && (
          <>
            <Button
              as={RouterLink}
              to={`/recipe/${recipe._id}/edit`}
              colorScheme="blue"
              variant="outline"
              size="sm"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              colorScheme="red"
              variant="outline"
              size="sm"
            >
              Delete
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default RecipeCard;
