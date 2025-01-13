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
} from "@chakra-ui/react";
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
      setRecipes(response.data);
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
      <Heading mb={8}>All Recipes</Heading>

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
          <RecipeCard
            key={recipe._id}
            recipe={recipe}
            onDelete={handleDelete}
          />
        ))}
      </SimpleGrid>

      {filteredAndSortedRecipes.length === 0 && (
        <Box textAlign="center" py={10}>
          No recipes found.
        </Box>
      )}
    </Container>
  );
};

export default RecipeList;
