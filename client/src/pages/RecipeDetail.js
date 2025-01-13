// client/src/pages/RecipeDetail.js
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  List,
  ListItem,
  ListIcon,
  Button,
  useToast,
  Box,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await recipeAPI.getById(id);
      setRecipe(response.data);
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
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await recipeAPI.delete(id);
      toast({
        title: "Recipe deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/recipes");
    } catch (error) {
      toast({
        title: "Error deleting recipe",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!recipe) return null;

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading mb={2}>{recipe.title}</Heading>
          <Text color="gray.600">
            By {recipe.author.username} •{" "}
            {new Date(recipe.createdAt).toLocaleDateString()}
          </Text>
        </Box>

        <Text>{recipe.description}</Text>

        <Box>
          <Heading size="md" mb={4}>
            Ingredients
          </Heading>
          <List spacing={2}>
            {recipe.ingredients.map((ingredient, index) => (
              <ListItem key={index}>
                <ListIcon as={MdCheckCircle} color="teal.500" />
                {ingredient}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Heading size="md" mb={4}>
            Steps
          </Heading>
          <List spacing={4}>
            {recipe.steps.map((step, index) => (
              <ListItem key={index}>
                <Text as="span" fontWeight="bold" mr={2}>
                  {index + 1}.
                </Text>
                {step}
              </ListItem>
            ))}
          </List>
        </Box>

        {user && user.id === recipe.author._id && (
          <HStack spacing={4} mt={4}>
            <Button
              colorScheme="blue"
              onClick={() => navigate(`/recipes/${id}/edit`)}
            >
              Edit Recipe
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete Recipe
            </Button>
          </HStack>
        )}
      </VStack>
    </Container>
  );
};

export default RecipeDetail;
