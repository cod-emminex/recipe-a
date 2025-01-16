// client/src/pages/RecipeList.js
import { useState, useEffect } from "react";
import {
  Container,
  SimpleGrid,
  Heading,
  Input,
  Box,
  Select,
  HStack,
  useToast,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";
import RecipeCard from "../components/RecipeCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { recipeAPI } from "../services/api";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const toast = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await recipeAPI.getAll();
      // Add number property to each recipe
      const numberedRecipes = response.data.map((recipe, index) => ({
        ...recipe,
        recipeNumber: index + 1,
      }));
      setRecipes(numberedRecipes);
    } catch (error) {
      toast({
        title: "Error fetching recipes",
        description: error.response?.data?.error || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setRecipes(recipes.filter((recipe) => recipe._id !== deletedId));
  };

  const filteredAndSortedRecipes = recipes
    .filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack
          justify="space-between"
          align="center"
          fontFamily={"Montserrat"}
        >
          <Heading fontFamily={"Montserrat"}>
            All Recipes ({recipes.length})
          </Heading>
          <Button
            as={RouterLink}
            to="/create-recipe"
            colorScheme="teal"
            leftIcon={<AddIcon />}
            fontFamily={"Montserrat"}
          >
            Add New Recipe
          </Button>
        </HStack>

        <HStack mb={8} spacing={4}>
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">By Title</option>
          </Select>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredAndSortedRecipes.map((recipe) => (
            <Box
              key={recipe._id}
              position="relative"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-4px)" }}
            >
              {/* Recipe Number Badge */}
              <Box
                position="absolute"
                top="-10px"
                left="-10px"
                bg="teal.500"
                color="white"
                borderRadius="full"
                w="30px"
                h="30px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                zIndex="1"
                boxShadow="md"
              >
                {recipe.recipeNumber}
              </Box>
              <RecipeCard recipe={recipe} onDelete={handleDelete} />
            </Box>
          ))}
        </SimpleGrid>

        {filteredAndSortedRecipes.length === 0 && (
          <Box
            textAlign="center"
            py={10}
            borderRadius="lg"
            bg="gray.50"
            color="gray.600"
          >
            <Text fontSize="lg" fontFamily={"Montserrat"} fontWeight={"bold"}>
              {searchTerm
                ? "No recipes found matching your search."
                : "No recipes available. Add your first recipe!"}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default RecipeList;
