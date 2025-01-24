// src/pages/RecipeDetail.js
import { useState, useEffect, useCallback, useRef } from "react";
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
  Image,
  Badge,
  Divider,
  Grid,
  GridItem,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { MdCheckCircle } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";
import { recipeAPI } from "../services/api";
import CountryDisplay from "../components/countryDisplay";

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRecipe = useCallback(async () => {
    try {
      setLoading(true);
      const response = await recipeAPI.getById(id);
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
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
  }, [id, toast, navigate]);
  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const recipeNumber = parseInt(recipe.recipeNumber);

      if (isNaN(recipeNumber)) {
        throw new Error("Invalid recipe number");
      }

      await recipeAPI.delete(recipeNumber);

      toast({
        title: "Recipe deleted successfully",
        description: `Recipe #${recipeNumber} has been deleted`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/recipes");
    } catch (error) {
      console.error("Delete error:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Error deleting recipe";

      toast({
        title: "Error deleting recipe",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };
  if (loading) return <LoadingSpinner />;
  if (!recipe) return null;

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Recipe Header with Image */}
        <Box position="relative">
          <Image
            src={recipe.image || "https://placehold.co/400?text=No+Image"}
            alt={recipe.title}
            w="100%"
            h="400px"
            objectFit="cover"
            borderRadius="lg"
          />
          <Box
            position="absolute"
            top="4"
            left="4"
            bg="teal.500"
            color="white"
            borderRadius="full"
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            fontSize="lg"
          >
            {recipe.recipeNumber}
          </Box>
        </Box>

        {/* Recipe Info */}
        <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
          <GridItem>
            <VStack align="stretch" spacing={6}>
              <Box>
                <Heading size="xl" mb={2} fontFamily="Montserrat">
                  {recipe.title}
                </Heading>
                <HStack spacing={4} mb={4}>
                  <Text color="gray.600" fontFamily="Montserrat">
                    By {recipe.author.username}
                  </Text>
                  <Text color="gray.600" fontFamily="Montserrat">
                    •
                  </Text>
                  <Text color="gray.600" fontFamily="Montserrat">
                    {new Date(recipe.createdAt).toLocaleDateString()}
                  </Text>
                </HStack>
                {recipe.country && (
                  <HStack spacing={2} mb={4}>
                    <CountryDisplay
                      country={recipe.country}
                      showLabel={false}
                    />
                    <Badge colorScheme="teal"></Badge>
                  </HStack>
                )}{" "}
              </Box>

              <Box bg="gray.50" p={6} borderRadius="md">
                <Text fontSize="lg" fontFamily="Montserrat">
                  {recipe.description}
                </Text>
              </Box>

              <Divider />

              {/* Ingredients Section */}
              <Box>
                <Heading size="lg" mb={4} fontFamily="Montserrat">
                  Ingredients
                </Heading>
                <List spacing={3}>
                  {recipe.ingredients.map((ingredient, index) => (
                    <ListItem
                      key={index}
                      display="flex"
                      alignItems="center"
                      fontFamily="Montserrat"
                    >
                      <ListIcon as={MdCheckCircle} color="teal.500" />
                      {ingredient}
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider />

              {/* Steps Section */}
              <Box>
                <Heading size="lg" mb={4} fontFamily="Montserrat">
                  Instructions
                </Heading>
                <List spacing={6}>
                  {recipe.steps.map((step, index) => (
                    <ListItem
                      key={index}
                      p={4}
                      bg="white"
                      borderRadius="md"
                      shadow="sm"
                      fontFamily="Montserrat"
                    >
                      <HStack align="start" spacing={4}>
                        <Box
                          bg="teal.500"
                          color="white"
                          borderRadius="full"
                          w="24px"
                          h="24px"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          flexShrink={0}
                        >
                          {index + 1}
                        </Box>
                        <Text>{step}</Text>
                      </HStack>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </VStack>
          </GridItem>

          {/* Sidebar */}
          <GridItem>
            <Box
              position="sticky"
              top="4"
              bg="white"
              p={6}
              borderRadius="lg"
              shadow="md"
            >
              <VStack spacing={4} align="stretch">
                {user && user.id === recipe.author._id && (
                  <>
                    <Button
                      colorScheme="blue"
                      onClick={() =>
                        navigate(`/recipe/${recipe.recipeNumber}/edit`)
                      }
                      w="100%"
                      fontFamily="Montserrat"
                    >
                      Edit Recipe
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={onOpen}
                      w="100%"
                      fontFamily="Montserrat"
                      isLoading={isDeleting}
                    >
                      Delete Recipe
                    </Button>
                  </>
                )}
                <Divider />
                <Box>
                  <Text
                    color="gray.600"
                    fontSize="sm"
                    mb={2}
                    fontFamily="Montserrat"
                  >
                    Recipe Details
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack justify="space-between">
                      <Text fontFamily="Montserrat">Date Created:</Text>
                      <Text fontFamily="Montserrat">
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontFamily="Montserrat">Author:</Text>
                      <Text fontFamily="Montserrat">
                        {recipe.author.username}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </GridItem>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Recipe {recipe.recipeNumber}
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to delete &#34;{recipe.title}&#34;? This
                  action cannot be undone.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    ref={cancelRef}
                    onClick={onClose}
                    fontFamily="Montserrat"
                  >
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDelete}
                    ml={3}
                    isLoading={isDeleting}
                    loadingText="Deleting..."
                    fontFamily="Montserrat"
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Grid>
      </VStack>
    </Container>
  );
};

export default RecipeDetail;
